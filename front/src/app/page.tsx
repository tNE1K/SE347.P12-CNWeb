"use client";
import NavBar from "@/app/component/navBar";
import CourseCard from "@/app/component/courseCard";
import { useState, useEffect } from "react";
import { ICourse } from "@/app/types/course";
import { getAllCourse } from "@/app/api/course";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

export default function Home() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [bannerCourses, setBannerCourses] = useState<ICourse[]>([]); // Courses for banner
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourse(1, 10, "rating");
        setCourses(response.data);
        setBannerCourses(response.data.slice(0, 3)); // Lấy 3 khóa học hàng đầu làm banner
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setBannerCourses([]);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourse(1, 10, "rating"); 
        setCourses(response.data); 
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([  
          {
            _id: "1",
            title: "React for Beginners",
            price: 100000,
            rating: 4.5,
            numberRatings: 100,
            cover: "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg",
            comments: [],
            description: "Learn the basics of React.",
            label: ["Frontend"],
            lessonIds: [],
            participantsId: [],
            status: "publish",
            createdAt: new Date().toISOString(),
            teacher_id: "",
            teacher: {
              _id: "1",
              avatar: "",
              email: "",
              fullName: "Nguyen Van A",
              isVerify: true,
              participatedCourses:[],
              password : "",
              role: "teacher"
            },
          },
          {
            _id: "2",
            title: "Advanced JavaScript",
            price: 150000,
            rating: 4.7,
            numberRatings: 200,
            cover: "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg",
            comments: [],
            description: "Master advanced JavaScript techniques.",
            label: ["Backend"],
            lessonIds: [],
            participantsId: [],
            status: "publish",
            createdAt: new Date().toISOString(),
            teacher_id: "",
            teacher: {
              _id: "2",
              avatar: "",
              email: "",
              fullName: "Nguyen Van B",
              isVerify: true,
              participatedCourses:[],
              password : "",
              role: "teacher"
            },
          },
        ]);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <NavBar />
      {/* Slide Banner */}
      <div className="p-4">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          {bannerCourses.map((course) => (
      <SwiperSlide key={course._id}>
        <div
          className="relative bg-cover bg-center flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
          style={{
            height: "400px", 
            backgroundImage: `url(${course.cover || 
              "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg"})`,
            borderRadius: "16px", 
          }}
          onClick={() => router.push(`/course/${course._id}`)}
        >
          <div className="bg-black bg-opacity-50 p-4 rounded-md">
            {course.title}
          </div>
        </div>
      </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Danh sách khóa học */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
}