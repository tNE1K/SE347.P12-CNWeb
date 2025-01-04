import { useAuth } from "@/app/component/authProvider";
import { ICourse } from "@/app/types/course";
import { IUser, User } from "@/app/types/user";
import axios from "axios";

function formatToVND(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} đ`;
}
function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number,
) {
  if (originalPrice === 0) {
    return 0;
  }
  if (originalPrice < 0 || discountedPrice < 0) {
    return 0;
  }
  const discount = originalPrice - discountedPrice;
  const discountPercentage = (discount / originalPrice) * 100;
  if (discountPercentage < 0) return 0;
  return discountPercentage.toFixed(0);
}
export default function CourseInfo({ course }: { course: ICourse }) {
  const { user, isAuthenticated, logout } = useAuth();
  // Hàm xử lý thanh toán khi người dùng nhấn "Mua ngay"
  
  const handlePayment = async () => {
    if (!user?.id) {
      alert("Vui lòng đăng nhập để thực hiện thanh toán!");
      window.location.href = "/login"; // Điều hướng đến trang đăng nhập
      return;
    }
    try {
      // Gửi yêu cầu thanh toán tới API backend
      const response = await axios.post(
        `${process.env.MY_API_URL}/payment/create_payment`,
        {
          order_type: "course", // Ví dụ về loại đơn hàng
          amount: course.price,
          order_desc: `Thanh toán khóa học: ${course.title}`,
          course_id: course._id,
          user_id: user?.id,
          current_url: window.location.href,
        },
        { withCredentials: true },
      );

      if (response.status === 200) {
        const redirectUrl = response.data;
        console.log(redirectUrl);
        // Chuyển hướng đến trang xác nhận thanh toán hoặc trang kết quả
        alert("Thanh toán thành công."); // Điều hướng thành công tới trang xác nhận
        window.location.href = redirectUrl;
      } else {
        // Xử lý khi thanh toán thất bại
        alert("Thanh toán không thành công. Vui lòng thử lại!");
      }
    } catch (error) {
      // Xử lý lỗi trong quá trình thanh toán
      console.error("Lỗi thanh toán:", error);
      alert("Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại!");
    }
  };
  return (
    <div
      className="mx-auto mt-[35%] h-fit w-[300px] overflow-hidden rounded-[4px] xl:w-[450px]"
      style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)" }}
    >
      <div
        className="h-[276px] w-full bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${course.cover})`,
        }}
      ></div>
      <div className="bg-white p-[20px]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-end gap-2">
            <p className="text-primary-500 text-2xl font-bold">
              đ{formatToVND(course?.price)}
            </p>
            <p className="text-lg font-semibold text-gray-400 line-through">
              đ{formatToVND(course?.price + 20000)}
            </p>
          </div>
          <p className="text-text/xl/regular mt-1">
            Giảm{" "}
            {calculateDiscountPercentage(course?.price + 20000, course?.price)}%
          </p>
        </div>
        <div className="mt-6 flex justify-between gap-2">
          {/* <div
            style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)" }}
            className={
              "flex-1 cursor-pointer select-none rounded-[8px] bg-blue-500 px-[16px] py-[12px] text-center font-semibold text-white"
            }
            onClick={() => {}}
          >
            Thêm vào giỏ hàng
          </div> */}
        </div>

        <div
          style={{
            boxShadow: "3px 10px 20px 0px rgba(0, 56, 255, 0.38)",
          }}
          className="font-worksans bg-primary-500 hover:bg-primary-600 mt-8 flex h-[48px] cursor-pointer items-center justify-center rounded-[8px] px-[16px] py-[12px] font-semibold text-black transition-all"
          onClick={handlePayment}
        >
          Mua ngay
        </div>
      </div>
    </div>
  );
}
