"use client";
import React from "react";
import LogInForm from "@/app/component/logInForm";

export default function LogIn() {
  return (
    <div className="flex h-full flex-row">
      {/*left side*/}
      <div className={"flex w-3/5 items-center justify-center bg-black"}>
        something
      </div>
      {/*right side*/}
      <div className="flex w-2/5 items-center justify-center bg-white">
        <LogInForm />
      </div>
    </div>
  );
}
