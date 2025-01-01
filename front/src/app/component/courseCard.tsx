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
function formatToVND(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} đ`;
}
export default function CourseCard({ course }: { course?: ICourse }) {
  return (
    <Card sx={{ maxWidth: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
  <CardActions sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <div style={{ flex: 2, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
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
    <Button size="small" color="primary">
      View
    </Button>
  </div>
</CardActions>
</Card>
  );
}
