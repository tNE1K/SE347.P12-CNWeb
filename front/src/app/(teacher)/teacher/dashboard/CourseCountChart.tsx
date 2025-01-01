"use client";
import dynamic from "next/dynamic";
import { Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#FF5555",
  "#FF00FF",
  "#00FF00",
  "#00FFFF",
  "#FF6347",
  "#FFD700",
  "#8A2BE2",
  "#A52A2A",
  "#DEB887",
  "#5F9EA0",
  "#7FFF00",
  "#D2691E",
  "#FF7F50",
  "#6495ED",
  "#FFF8DC",
  "#DC143C",
  "#00BFFF",
  "#1E90FF",
  "#32CD32",
  "#FFD700",
  "#FF1493",
  "#F0E68C",
  "#8B0000",
  "#FA8072",
  "#FF6347",
  "#4682B4",
  "#6A5ACD",
  "#D2B48C",
  "#FF4500",
  "#DAA520",
  "#A9A9A9",
  "#808080",
  "#D3D3D3",
  "#FF69B4",
  "#CD5C5C",
  "#F08080",
  "#E0FFFF",
  "#90EE90",
  "#B0E0E6",
  "#ADD8E6",
  "#FFB6C1",
  "#FF00FF",
  "#C71585",
  "#8B4513",
  "#D2691E",
  "#B8860B",
  "#A9A9A9",
  "#8B008B",
  "#556B2F",
  "#FF1493",
  "#C71585",
  "#F4A460",
  "#D2B48C",
  "#C0C0C0",
  "#2F4F4F",
  "#708090",
  "#808000",
  "#9ACD32",
  "#FF8C00",
  "#B22222",
  "#8B0000",
  "#BDB76B",
  "#FF6347",
  "#F0E68C",
  "#E6E6FA",
  "#A8A8A8",
  "#B0C4DE",
  "#DCDCDC",
  "#D8BFD8",
  "#FF6347",
  "#40E0D0",
  "#98FB98",
  "#8FBC8F",
  "#BC8F8F",
  "#F0FFF0",
  "#C71585",
  "#7CFC00",
  "#FF4500",
  "#D2691E",
  "#E9967A",
  "#8A2BE2",
  "#F5FFFA",
  "#7FFF00",
  "#D2B48C",
  "#98FB98",
  "#A52A2A",
  "#6B8E23",
  "#FF1493",
  "#FF6347",
  "#FF4500",
  "#2F4F4F",
  "#B0E0E6",
  "#32CD32",
  "#FFD700",
  "#7B68EE",
  "#BC8F8F",
];
const PieChart = dynamic(
  () => import("recharts").then((recharts) => recharts.PieChart),
  {
    ssr: false,
  },
);
const CourseCountChart = ({
  data,
}: {
  data: {
    label: string;
    numberCourse: number;
  }[];
}) => {
  const newData = data.map((dt) => ({
    name: dt.label,
    value: dt.numberCourse,
  }));
  return (
    <PieChart height={300} width={400}>
      <Pie
        data={newData}
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
export default CourseCountChart;
