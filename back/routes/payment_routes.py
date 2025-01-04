import os
from bson import ObjectId
from flask import Blueprint, Flask, request, redirect, jsonify
from datetime import datetime
from models.course_model import Course
from config import Config
from flask_cors import CORS
from pymongo import MongoClient
import hashlib
import hmac
import urllib.parse
import hashlib
client = MongoClient(os.getenv("MONGO_URI"))
db = client["backend"]
courses_collection = db['courses']  
payment_blueprint = Blueprint("payment", __name__)
#CORS(payment_blueprint, origins="*", supports_credentials=True)
CORS(payment_blueprint, origins=["http://localhost:3000"], supports_credentials=True)
# Configurations (replace with your real VNPAY configurations)
VNPAY_TMN_CODE = "DEXN209R" #for testing only
VNPAY_PAYMENT_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_HASH_SECRET_KEY = "PDBGSF700IA65NESBHT4K2B3EGDNYNM9" #for testing only
VNPAY_RETURN_URL = "https://811c-115-74-192-50.ngrok-free.app/payment/test"


def generate_payment_id(course_id, user_id):
    current_time = datetime.now()
    # Chuyển thành chuỗi định dạng YYYYMMDDHHMMSS
    timestamp = current_time.strftime('%Y%m%d%H%M%S')
    # Ghép các trường dữ liệu
    raw_string = f"{timestamp}:{user_id}:{course_id}"
    # Hash dữ liệu
    hashed = hashlib.sha256(raw_string.encode('utf-8')).hexdigest()
    # Chuyển hash thành số nguyên và lấy 10 chữ số đầu tiên
    numeric_id = str(int(hashed, 16))[:99]
    return numeric_id



# Helper function to get client IP
def get_client_ip():
    if request.environ.get('HTTP_X_FORWARDED_FOR'):
        return request.environ['HTTP_X_FORWARDED_FOR']
    else:
        return request.environ['REMOTE_ADDR']

# VNPAY helper class
class VNPAY:
    def __init__(self):
        self.request_data = {}

    def build_payment_url(self, payment_url, secret_key):
        sorted_data = sorted(self.request_data.items())
        query_string = urllib.parse.urlencode(sorted_data)
        hash_value = hmac.new(
            secret_key.encode('utf-8'),
            query_string.encode('utf-8'),
            hashlib.sha512
        ).hexdigest()
        return f"{payment_url}?{query_string}&vnp_SecureHash={hash_value}"

@payment_blueprint.route('/create_payment', methods=['POST'])
def payment():
    if request.method == 'POST':
        data = request.json
        user_id = data.get('user_id')
        course_id = data.get('course_id')
        order_type = data.get('order_type')
        amount = data.get('amount')
        order_desc = data.get('order_desc')
        current_url = data.get('current_url')
        ipaddr = get_client_ip()
        payment_id = generate_payment_id(course_id, user_id)
        # Validate required fields
        if not all([user_id, course_id, order_type, amount, order_desc, current_url]):
            return jsonify({"error": "Missing required fields"}), 400
        VNPAY_RETURN_URL = f"{VNPAY_RETURN_URL}?user_id={user_id}&course_id={course_id}"
        #print(request.json)
        # Build VNPAY request
        vnp = VNPAY()
        vnp.request_data['vnp_Version'] = '2.1.0'
        vnp.request_data['vnp_Command'] = 'pay'
        vnp.request_data['vnp_TmnCode'] = VNPAY_TMN_CODE
        vnp.request_data['vnp_Amount'] = int(amount) * 100
        vnp.request_data['vnp_CurrCode'] = 'VND'
        vnp.request_data['vnp_TxnRef'] = payment_id
        vnp.request_data['vnp_OrderInfo'] = order_desc
        vnp.request_data['vnp_OrderType'] = order_type
        vnp.request_data['vnp_Locale'] = "vn"
        vnp.request_data['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')
        vnp.request_data['vnp_IpAddr'] = ipaddr
        vnp.request_data['vnp_ReturnUrl'] = VNPAY_RETURN_URL
        print("Day la Return URL: " + VNPAY_RETURN_URL)

        #vnp.request_data['vnp_BankCode'] = "VNPAYQR"

        # Generate payment URL
        payment_url = vnp.build_payment_url(VNPAY_PAYMENT_URL, VNPAY_HASH_SECRET_KEY)
        print(f"Redirecting to payment URL: {payment_url}")

        return jsonify(payment_url), 200
    else:
        return jsonify({"error": "Method not allowed"}), 405
    
@payment_blueprint.route('/test', methods=['GET'])
def test_payment():
    vnp_response = request.args.to_dict()
    vnp_secure_hash = vnp_response.pop('vnp_SecureHash', None)  # Lấy chữ ký

    # Sắp xếp các tham số còn lại theo thứ tự alphabet
    sorted_params = sorted(vnp_response.items())
    query_string = urllib.parse.urlencode(sorted_params)

    # Tính toán lại chữ ký bằng hash
    hmac_obj = hmac.new(
        VNPAY_HASH_SECRET_KEY.encode('utf-8'),
        query_string.encode('utf-8'),
        hashlib.sha512
    )
    calculated_hash = hmac_obj.hexdigest()
    
    # So sánh chữ ký đã tính toán với chữ ký từ VNPAY
    if calculated_hash == vnp_secure_hash:
        # Nếu chữ ký hợp lệ, kiểm tra mã phản hồi
        response_code = vnp_response.get("vnp_ResponseCode")
        if response_code == "00":
            # Lấy user_id và course_id từ tham số URL
            user_id = vnp_response.get("user_id")
            course_id = vnp_response.get("course_id")
            if user_id:
                if course_id:
                    result = courses_collection.update_one(
                        {"_id": ObjectId(course_id)},
                        {"$addToSet": {"participantsId": user_id}}  # Sử dụng $addToSet để tránh trùng lặp
                    )

                    if result.matched_count == 0:
                        return jsonify({"message": "Course not found."}), 404

                    return jsonify({
                        "status": "success",
                        "message": "Người dùng đã thanh toán khóa học thành công."
                    }), 200
                else:
                    return jsonify({"error": "Khóa học không tồn tại"}), 404
            else:
                return jsonify({"error": "Người dùng không tồn tại"}), 404
        else:
            return jsonify({"message": "Thanh toán thất bại", "data": vnp_response}), 400
    else:
        return jsonify({"error": "Chữ ký không hợp lệ"}), 400