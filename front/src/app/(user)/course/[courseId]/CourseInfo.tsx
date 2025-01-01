import { ICourse } from "@/app/types/course";
import React from "react";
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
          <div
            style={{ boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)" }}
            className={
              "flex-1 cursor-pointer select-none rounded-[8px] bg-blue-500 px-[16px] py-[12px] text-center font-semibold text-white"
            }
            onClick={() => {}}
          >
            Thêm vào giỏ hàng
          </div>
        </div>

        <div
          style={{
            boxShadow: "3px 10px 20px 0px rgba(0, 56, 255, 0.38)",
          }}
          className="font-worksans bg-primary-500 hover:bg-primary-600 mt-8 flex h-[48px] cursor-pointer items-center justify-center rounded-[8px] px-[16px] py-[12px] font-semibold text-black transition-all"
          onClick={async () => {}}
        >
          Mua ngay
        </div>
      </div>
    </div>
  );
}
