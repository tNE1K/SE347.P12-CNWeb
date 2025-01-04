"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { Check, X, Loader2 } from "lucide-react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SyncIcon from "@mui/icons-material/Sync";
const PaymentPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending"); // "pending" | "success" | "error"
  const searchParams = useSearchParams();

  const params = {
    user_id: searchParams.get("user_id"),
    course_id: searchParams.get("course_id"),
    vnp_SecureHash: searchParams.get("vnp_SecureHash"),
    vnp_Amount: searchParams.get("vnp_Amount"),
    vnp_OrderInfo: searchParams.get("vnp_OrderInfo"),
    vnp_TransactionStatus: searchParams.get("vnp_TransactionStatus"),
    vnp_ResponseCode: searchParams.get("vnp_ResponseCode"),
    vnp_TransactionNo: searchParams.get("vnp_TransactionNo"),
    vnp_TxnRef: searchParams.get("vnp_TxnRef"),
    vnp_PayDate: searchParams.get("vnp_PayDate"),
    vnp_BankCode: searchParams.get("vnp_BankCode"),
    vnp_BankTranNo: searchParams.get("vnp_BankTranNo"),
    vnp_CardType: searchParams.get("vnp_CardType"),
    vnp_TmnCode: searchParams.get("vnp_TmnCode"),
  };

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      setLoading(true);
      try {
        const queryString = Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value || "")}`)
          .join("&");

        const response = await axios.get(
          `${process.env.MY_API_URL}/payment/test?${queryString}`,
          { withCredentials: true },
        );

        if (response.status === 200) {
          setMessage(response.data.message || "Thanh toán thành công");
          setStatus("success");
        } else {
          setMessage(response.data.error || "Đã có lỗi xảy ra");
          setStatus("error");
        }
      } catch (error) {
        setMessage("Có lỗi xảy ra khi kết nối tới server");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, Object.values(params));

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getIcon = () => {
    if (loading) {
      return <SyncIcon className="h-12 w-12 animate-spin text-blue-500" />;
    }
    switch (status) {
      case "success":
        return <CheckCircleOutlineIcon className="h-12 w-12 text-green-500" />;
      case "error":
        return <CloseIcon className="h-12 w-12 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div
        className={`w-full max-w-md rounded-lg border p-8 shadow-lg ${getStatusColor()}`}
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">{getIcon()}</div>

          <h2 className="mb-4 text-2xl font-semibold">Thông báo thanh toán</h2>

          {loading ? (
            <p className="text-gray-600">Đang xử lý thanh toán...</p>
          ) : (
            <>
              <p
                className={`text-lg ${status === "success" ? "text-green-700" : "text-red-700"}`}
              >
                {message}
              </p>

              {status === "success" && (
                <div className="mt-6 space-y-2 text-left text-sm text-gray-600">
                  <p>Mã giao dịch: {params.vnp_TransactionNo}</p>
                  <p>Số tiền: {parseInt(params.vnp_Amount || "0") / 100} VND</p>
                  <p>Ngân hàng: {params.vnp_BankCode}</p>
                  <p>Thời gian: {params.vnp_PayDate}</p>
                </div>
              )}

              <div className="mt-8">
                <button
                  className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                  onClick={() => (window.location.href = "/")}
                >
                  Về trang chủ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
