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
    <Card sx={{ maxWidth: 350, minWidth: 350 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{ maxHeight: 180, minHeight: 180 }}
          image={
            course?.cover ||
            "https://aptech.fpt.edu.vn/wp-content/uploads/2022/10/mot-so-ung-dung-cua-lap-trinh-la-gi.jpg"
          }
          alt="course's thumbnail goes here"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {course?.title || "Lizard"}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={"flex justify-between"}>
        <div className="flex gap-2">
          <p className="text-lg font-semibold">
            {formatToVND(course?.price || 0)}
          </p>
          <Rating
            name="half-rating-read"
            value={course?.rating || 0}
            precision={0.5}
            readOnly
          />
        </div>
        <Button size="small" color="primary">
          View
        </Button>
      </CardActions>
    </Card>
  );
}
