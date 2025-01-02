"use client";
import { Rating } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { ICourse } from "../types/course";
import { useRouter } from "next/navigation"; // Import useRouter

function formatToVND(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} đ`;
}

export default function CourseCard({
  course,
  isLearning = false,
}: {
  course?: ICourse;
  isLearning?: boolean;
}) {
  const router = useRouter(); // Khởi tạo useRouter

  const handleViewCourse = () => {
    if (course?._id) {
      router.push(`/course/${course._id}`); // Điều hướng đến trang chi tiết
    }
  };
  const handleLearnCourse = () => {
    if (course?._id) {
      router.push(`/learning/${course._id}`); // Điều hướng đến trang chi tiết
    }
  };
  return (
    <Card
      sx={{
        maxWidth: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: 3, // Adding shadow effect here
        "&:hover": {
          boxShadow: 6, // Adding shadow effect on hover
        },
        zIndex: 10,
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{ maxHeight: 180, minHeight: 180, objectFit: "cover" }}
          image={
            course?.cover ||
            "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg"
          }
          alt="course's thumbnail"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {course?.title || "Untitled Course"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course?.description || "No description available."}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <p className="text-lg font-semibold" style={{ margin: 0 }}>
            {formatToVND(course?.price || 0)}
          </p>
          <Rating
            name="half-rating-read"
            value={course?.rating || 0}
            precision={0.5}
            readOnly
            sx={{ mt: 1 }}
          />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          {!isLearning && (
            <Button size="small" color="primary" onClick={handleViewCourse}>
              View
            </Button>
          )}
          {isLearning && (
            <Button size="small" color="primary" onClick={handleLearnCourse}>
              Learn
            </Button>
          )}
        </div>
      </CardActions>
    </Card>
  );
}
