"use client";
import Rating from "@/app/(teacher)/components/RatingBar/Rating";
import { getCourseById } from "@/app/api/course";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import CourseInfo from "./CourseInfo";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { MenuItem, Pagination, Select } from "@mui/material";
import { getCommentsByCourseId } from "@/app/api/comments";
import CommentSection from "@/app/(teacher)/teacher/comments/CommentSection";
const html = `<p>Bạn có biết:</p><p>Khóa học "Cẩm nang A-Z Illustrator cho Designer" chính là dành cho bạn, người...</p><p>Đam mê yêu thích đồ họa, nhiếp ảnh, thiết kế sản phẩm.</p><p>Đang đi làm cần bổ sung, chuẩn hóa kiến thức, tăng khả năng hoàn thiện và thăng tiến trong nghề nghiệp</p><p>Sinh viên chuyên ngành marketing, truyền thông, mỹ thuật, thiết đồ họa, thời trang, họa viên… cần kỹ năng sử dụng thành thạo phần mềm illustrator để&nbsp;phục vụ cho công việc và học thiết kế...</p><p>Đang làm việc trong lĩnh vực marketing, truyền thông, kinh doanh,…</p><p>Và bất cứ ai yêu thích công việc sáng tạo và thiết kế với phần mềm Adobe Illustrator!</p><p>Hãy tham gia ngay khóa học "Cẩm nang A-Z Illustrator cho Designer" tại Unica!</p><p>&nbsp;&nbsp;✔️ Khóa học do giảng viên Phạm Đức Huy trực tiếp hướng dẫn. Khóa học sẽ giúp bạn có được những kiến thức và kỹ năng nền tảng nhất để các bạn tiến gần hơn và trở thành một Graphic Designer, Web Designer, Game UI UX Designer hoặc Motion Graphic Designer ngay tại nhà!</p><p>&nbsp;&nbsp;✔️ Khóa học là nền tảng để các bạn hiểu sâu hơn về bản chất công cụ của phần mềm Adobe Illustrator, từ đó các bạn dễ dàng xin được việc tại các công ty thiết kế lớn ở Việt Nam.</p><p>&nbsp;&nbsp;✔️ Khóa học được soạn từ những dự án thực tế với nhiều khách hàng, vì vậy tính ứng dụng của khóa học luôn gắn liền với thị trường hiện tại. Học viên có thể ứng dụng ngay những kiến thức và kỹ năng mình học được vào trong công việc hiện tại của bản thân.</p><p>Nội dung khóa học cụ thể:</p><p>Phần 1: Giới thiệu và hướng dẫn tạo các hình khối</p><p>Phần 2: Các tính năng của Shapes và bài tập thực hành</p><p>Phần 3: Hướng dẫn các công cụ Drawing Tools, Pen Tool và Brushes</p><p>Phần 4: Hướng dẫn các công cụ nâng cao trong thiết kế đồ họa</p><p>Trở thành nhà thiết kế chuyên nghiệp với phần mềm Ai ngay hôm nay với khóa học "Cẩm nang A-Z Illustrator cho Designer" tại EduHub thôi nào!</p>`;
export default function page() {
  const params = useParams<{ courseId: string }>();
  const [order, setOrder] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const { data } = useQuery({
    queryKey: ["course-detail", { courseId: params.courseId }],
    queryFn: () => getCourseById(params.courseId),
  });
  const course = data?.data || undefined;
  const { data: commentsRes } = useQuery({
    queryKey: [
      "comments",
      { courseId: course?._id, sortBy: order, page: page },
    ],
    queryFn: () => {
      if (!course) return Promise.resolve(null);
      return getCommentsByCourseId(page, 5, course._id, order);
    },
    enabled: !!course?._id,
  });
  const totalPages = commentsRes?.pagination?.total_pages || 0;
  const comments = commentsRes?.data || [];
  if (!course) return <></>;
  return (
    <div className="min-h-[200vh] w-full">
      <div
        className="relative h-[422px] w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${"https://www.shutterstock.com/image-vector/online-education-vector-banner-home-260nw-1821642545.jpg"})`,
        }}
      >
        <div className="bg-course-ct absolute flex h-full w-full gap-12 px-24">
          <div className="flex h-full basis-[60%] flex-col justify-end gap-2 pb-12">
            <header className="text-3xl font-semibold text-white">
              {course?.title}
            </header>
            <div className="flex items-center gap-4">
              <p className="text-white">{course?.rating.toFixed(1)}</p>
              <div className="flex">
                <Rating
                  rating={course?.rating ? course.rating : 0}
                  className="text-warning-500 h-[24px] w-[24px]"
                />
              </div>
              <p className="text-text/md/regular text-white">
                ({course?.numberRatings} đánh giá)
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-text/md/regular text-white">Giảng viên:</p>
              <p className="text-text/md/semibold text-white underline">
                {course?.teacher?.fullName}
              </p>
            </div>
          </div>
          <div className="basis-[40%]">
            <CourseInfo course={course} />
            {/* <LecturerInfo course={course} /> */}
          </div>
        </div>
      </div>
      <div className="flex gap-12 px-24 py-[24px]">
        <div className="w-[60%]">
          <div
            className={`border-success-100 relative mt-4 w-full rounded-[12px] border-[4px]`}
          >
            <header className="bg-success-100 text-success-700 inline-block h-[48px] w-[240px] rounded-br-[4px] text-center text-lg font-semibold leading-[48px]">
              Giới thiệu khóa học
            </header>
            <div
              className={`${showMore ? "h-full" : "max-h-[400px]"} ${
                showMore ? "animate-scrollDown" : "animate-scrollUp"
              } text-text/lg/regular mb-9 overflow-hidden p-[20px] pb-0`}
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
            <div
              onClick={() => {
                setShowMore((prev) => !prev);
              }}
              className={`text-success-600 hover:text-success-700 absolute bottom-[1%] flex cursor-pointer items-center gap-1 px-[20px] transition-all`}
            >
              {showMore ? <p>Ẩn bớt</p> : <p>Xem thêm</p>}
              {showMore ? (
                <KeyboardArrowUpIcon className="h-[18px] w-[18px]" />
              ) : (
                <KeyboardArrowDownIcon className="h-[18px] w-[18px]" />
              )}
            </div>
          </div>
          <div className="mt-8">
            <p className="text-2xl font-bold">Comments</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4"></div>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={order}
                size="small"
                onChange={(v) => setOrder(v.target.value)}
              >
                <MenuItem value={"-createdAt"}>Newest</MenuItem>
                <MenuItem value={"createdAt"}>Oldest</MenuItem>
                <MenuItem value={"rating"}>Top Rating</MenuItem>
              </Select>
            </div>
            <div className="mt-8"></div>
          </div>
          <CommentSection comments={comments} />
          <div className="mt-8 flex justify-center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => {
                setPage(value);
              }}
              variant="outlined"
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
