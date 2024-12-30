import React from "react";
import SideBar from "./components/SideMenu";
import Header from "./components/Header";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex flex-row"}>
      <div className="basis-[17%]">
        <SideBar />
      </div>
      <div className={"relative flex w-full basis-[83%] flex-col"}>
        <Header />
        <div className="mt-[60px]"></div>
        {children}
      </div>
    </div>
  );
}
