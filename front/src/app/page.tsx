"use client";
import NavBar from "@/app/component/navBar";
import CourseCard from "@/app/component/courseCard";
import { useState, useEffect } from "react";
import { ICourse } from "@/app/types/course";
import { getAllCourse } from "@/app/api/course";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

export default function Home() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [bannerCourses, setBannerCourses] = useState<ICourse[]>([]); // Courses for banner
  const [popularCourses, setPopularCourses] = useState<ICourse[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourse(1, 10, "rating");
        setCourses(response.data);
        console.log("Bug" + response.data);
        const sortedCourses = response.data.sort((a, b) => b.rating - a.rating);
        setBannerCourses(sortedCourses.slice(0, 3)); 
        setPopularCourses(sortedCourses.slice(0, 5)); 
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setBannerCourses([]);
        setPopularCourses([]);
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
        // setCourses([  
        //   {
        //     _id: "1",
        //     title: "React for Beginners",
        //     price: 100000,
        //     rating: 4.5,
        //     numberRatings: 100,
        //     cover: "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg",
        //     comments: [],
        //     description: "Learn the basics of React.",
        //     label: ["Frontend"],
        //     lessonIds: [],
        //     participantsId: [],
        //     status: "publish",
        //     createdAt: new Date().toISOString(),
        //     teacher_id: "",
        //     teacher: {
        //       _id: "1",
        //       avatar: "",
        //       email: "",
        //       fullName: "Nguyen Van A",
        //       isVerify: true,
        //       participatedCourses:[],
        //       password : "",
        //       role: "teacher"
        //     },
        //   },
        //   {
        //     _id: "2",
        //     title: "Advanced JavaScript",
        //     price: 150000,
        //     rating: 4.7,
        //     numberRatings: 200,
        //     cover: "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg",
        //     comments: [],
        //     description: "Master advanced JavaScript techniques.",
        //     label: ["Backend"],
        //     lessonIds: [],
        //     participantsId: [],
        //     status: "publish",
        //     createdAt: new Date().toISOString(),
        //     teacher_id: "",
        //     teacher: {
        //       _id: "2",
        //       avatar: "",
        //       email: "",
        //       fullName: "Nguyen Van B",
        //       isVerify: true,
        //       participatedCourses:[],
        //       password : "",
        //       role: "teacher"
        //     },
        //   },
        // ]);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <NavBar />
      {/* Slide Banner */}
      <div className="p-3">
      
        <Swiper
          modules= {[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next', // Custom next button
            prevEl: '.swiper-button-prev', // Custom prev button
          }}
          pagination={{ clickable: true }}
          loop
          style={{ maxWidth: "800px", margin: "20 auto" }}
          autoplay={{
            delay: 3000, // Thời gian chuyển slide tự động (3 giây)
            disableOnInteraction: false, // Để autoplay không dừng khi người dùng tương tác
          }}
          effect="fade" // Thêm hiệu ứng fade
          
        >
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
          {bannerCourses.map((course) => (
      <SwiperSlide key={course._id}>
        <div
          className="relative bg-cover bg-center flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
          style={{
            height: "400px", 
            backgroundImage: `url(${course.cover || 
              "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg"})`,
            borderRadius: "16px", 
            margin: "30px"
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

      {/* Danh sách khóa học phổ biến */}
      <div className="p-3">
        <h2 className="text-2xl font-bold mb-4">Best Seller</h2>
        <Swiper
          modules= {[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          navigation
          pagination={{ clickable: true }}
          
        >
          {popularCourses.map((course) => (
            <SwiperSlide key={course._id}>
              <div style={{margin: "30px"}}><CourseCard course={course} /></div>
              
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


      {/* Danh sách khóa học */}
      <div className="p-3">
        <h2 className="text-2xl font-bold mb-4">All courses</h2>
        <Swiper
          modules= {[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          navigation
          pagination={{clickable: true }}
        >
          {courses.map((course) => (
            <SwiperSlide key={course._id}>
              <div style={{margin: "30px"}}>
              <CourseCard course={course} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}