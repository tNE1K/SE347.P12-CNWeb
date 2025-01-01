import { ReactNode } from "react";

const StatBox = ({
  title,
  subtitle,
  progress,
  increase,
  icon,
}: {
  title: string;
  subtitle: string;
  progress: number;
  increase: string;
  icon: ReactNode;
}) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500">{subtitle}</p>
        </div>
        <div>{icon}</div>
      </div>
      <div className="mt-4">
        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <div
            className={`h-2.5 rounded-full bg-blue-600`}
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {increase} since last month
        </p>
      </div>
    </div>
  );
};

export default StatBox;
