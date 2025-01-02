"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface UserEnrollCourseCountProps {
  data: {
    name: string;
    numberEnroll: number;
  }[];
}

const MonthlyUserChart: React.FC<UserEnrollCourseCountProps> = ({ data }) => {
  const newData = data.map((dt) => ({
    name: dt.name,
    value: dt.numberEnroll,
  }));
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={newData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis className="text-sm" dataKey="name" />
          <YAxis />
          <Tooltip labelClassName="text-black" />
          <Legend
            formatter={() => "Học viên"} // Custom legend text
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyUserChart;
