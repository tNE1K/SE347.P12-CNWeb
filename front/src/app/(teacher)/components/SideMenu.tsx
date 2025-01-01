"use client";
import * as React from "react";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import { Notifications } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MessageIcon from "@mui/icons-material/Message";
const drawerWidth = 240;
const menuItems = [
  {
    label: "Dashboard",
    href: "/teacher/dashboard",
    icon: <HomeIcon />,
  },
  {
    label: "Courses",
    href: "/teacher/courses",
    icon: <MenuBookIcon />,
  },
  {
    label: "Comments",
    href: "/teacher/comments",
    icon: <MessageIcon />,
  },
  {
    label: "Notifications",
    href: "/teacher/notis",
    icon: <Notifications />,
  },
  {
    label: "My Profile",
    href: "/teacher/settings",
    icon: <PersonIcon />,
  },
];
export default function SideBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };
  return (
    <div className="fixed min-h-[200vh] w-[17%] border-r-[1px]">
      <div className="flex select-none justify-center py-6 text-2xl font-bold text-black">
        pro<span className="text-blue-600">c</span>ode
      </div>
      <div className="flex flex-col gap-1">
        {menuItems.map((el, idx) => (
          <Link href={el.href} key={idx}>
            <div
              className={`${isActive(el.href) ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"} d mx-2 flex items-center gap-4 rounded-md px-4 py-3 transition-all`}
            >
              <div>{el.icon}</div>
              <div>{el.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
