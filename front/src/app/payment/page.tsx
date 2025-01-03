"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const PaymentPage = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.MY_API_URL}/payment/test`,
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
}, []); // Chạy một lần khi trang được tải

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
