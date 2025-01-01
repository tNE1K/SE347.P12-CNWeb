from flask import Blueprint, request, jsonify
from utils.token_utils import token_required
from models.user_model import User
import jwt
import os

JWT_SECRET = os.getenv("JWT_SECRET")

user_blueprint = Blueprint('/user', __name__)

@user_blueprint.route('/profile', methods=['GET', 'PUT'])
@token_required
def profile(current_user):
    if request.method == 'GET':
        return jsonify(current_user), 200
    if request.method == 'PUT':
        # Update user profile logic
        return jsonify({"message": "Profile updated"}), 200
    
@user_blueprint.route('/me', methods=['GET'])
@token_required
def get_user_info():
    token = request.cookies.get("auth_token")
    if not token:
        return jsonify({"message": "Unauthorized"}), 401
    try:
        user_data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return jsonify(
            {
                "id": user_data["user_id"],
                "email": user_data["email"],
                "role": user_data["role"],
                "isVerify": user_data["isVerify"],
            }
        )
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

@user_blueprint.route('/update', methods=['POST'])
@token_required
def update_user_details(payload):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    email = data.get("email")
    update_data = data.get("updateData")

    if not email or not update_data:
        return jsonify({"error": "Missing required fields: 'email' or 'updateData'"}), 400

    birthday = update_data.get("birthday")
    first_name = update_data.get("firstName")
    last_name = update_data.get("lastName")

    if not all([birthday, first_name, last_name]):
        return jsonify({"error": "Missing fields in updateData"}), 400

    User.update_user_birthday(email, birthday)
    User.update_user_first_name(email, first_name)
    User.update_user_last_name(email, last_name)

    return jsonify({"message": "success"}), 200
