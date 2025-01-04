"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentPage = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams  = useSearchParams();
  const user_id = searchParams.get("user_id");
  const course_id = searchParams.get("course_id");
  const vnp_SecureHash = searchParams.get("vnp_SecureHash");
  const vnp_Amount = searchParams.get("vnp_Amount");
  const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
  const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
  const vnp_TxnRef = searchParams.get("vnp_TxnRef");
  const vnp_PayDate = searchParams.get("vnp_PayDate");
  const vnp_BankCode = searchParams.get("vnp_BankCode");
  const vnp_BankTranNo = searchParams.get("vnp_BankTranNo");
  const vnp_CardType = searchParams.get("vnp_CardType");
  const vnp_TmnCode = searchParams.get("vnp_TmnCode");


  useEffect(() => {
    const fetchPaymentStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.MY_API_URL}/payment/test?user_id=${user_id}&course_id=${course_id}&vnp_Amount=${vnp_Amount}&vnp_BankCode=${vnp_BankCode}&vnp_BankTranNo=${vnp_BankTranNo}&vnp_CardType=${vnp_CardType}&vnp_OrderInfo=${vnp_OrderInfo}&vnp_PayDate=${vnp_PayDate}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_SecureHash=${vnp_SecureHash}&vnp_TmnCode=${vnp_TmnCode}&vnp_TransactionNo=${vnp_TransactionNo}&vnp_TransactionStatus=${vnp_TransactionStatus}&vnp_TxnRef=${vnp_TxnRef}`,
          { withCredentials: true },
        );
        console.log("Accepted:", response.data);

        // Kiểm tra nếu có phản hồi hợp lệ từ server
      if (response.status === 200) {
        setMessage(response.data.message || "Thanh toán thành công");
      } else {
        setMessage(response.data.error || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra khi kết nối tới server");
    } finally {
      setLoading(false);
    }
  };
  fetchPaymentStatus();
}, [user_id,course_id,vnp_Amount,vnp_BankCode,vnp_BankTranNo,vnp_CardType,vnp_OrderInfo,vnp_PayDate,vnp_ResponseCode,vnp_SecureHash,vnp_TmnCode,vnp_TransactionNo,vnp_TransactionStatus,vnp_TxnRef]); // Chạy một lần khi trang được tải

  return (
    <div>
      <h1>Thông báo thanh toán</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default PaymentPage;
