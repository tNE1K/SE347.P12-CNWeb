"use client";
import NavBar from "@/app/component/navBar";
import CourseCard from "@/app/component/courseCard";
import { useState, useEffect } from "react";
import { ICourse } from "@/app/types/course";
import { getAllCourse } from "@/app/api/course";

export default function Home() {
  const [courses, setCourses] = useState<ICourse[]>([]);

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
            cover:
              "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg",
            comments: [],
            description: "Learn the basics of React.",
            label: ["Frontend"],
            lessonIds: [],
            participantsId: [],
            status: "publish",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "2",
            title: "Advanced JavaScript",
            price: 150000,
            rating: 4.7,
            numberRatings: 200,
            cover:
              "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg",
            comments: [],
            description: "Master advanced JavaScript techniques.",
            label: ["Backend"],
            lessonIds: [],
            participantsId: [],
            status: "publish",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-3 gap-4">
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
