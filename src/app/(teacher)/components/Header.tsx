"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
  const pathname = usePathname();
  const getHeaderTitle = () => {
    if (pathname.startsWith("/teacher/dashboard")) {
      return "Dashboard";
    } else if (pathname.startsWith("/teacher/courses")) {
      return "Courses";
    } else if (pathname.startsWith("/teacher/users")) {
      return "Users";
    } else if (pathname.startsWith("/teacher/notis")) {
      return "Notifications";
    } else if (pathname.startsWith("/teacher/settings")) {
      return "Settings";
    } else {
      return "Welcome";
    }
  };
  return (
    <div className="fixed left-0 right-0 top-0 ml-[17%] border-b-[1px] bg-white p-2 px-4">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">{getHeaderTitle()}</p>
        <div
          className={
            "h-[40px] w-[40px] cursor-pointer rounded-full bg-cover bg-center"
          }
          style={{
            backgroundImage: `url(https://w7.pngwing.com/pngs/364/361/png-transparent-account-avatar-profile-user-avatars-icon-thumbnail.png)`,
          }}
        ></div>
      </div>
    </div>
  );
}
