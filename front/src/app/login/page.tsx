"use client";
import React from "react";
import LogInForm from "@/app/component/logInForm";
import Image from "next/image";

export default function LogIn() {
  return (
    <div className="flex min-h-[100vh] flex-row">
      {/*left side*/}
      <div className="min-h-[100vh] w-3/5 bg-blue-100 flex items-center  relative overflow-hidden">
        <div className="absolute top-[0px] left-[-200px] w-[300px] h-[300px] bg-red-300 rounded-full"></div>
        <div className="absolute top-[-200px] right-[-300px] w-[600px] h-[600px] bg-green-200 rounded-full"></div>
        <div className="absolute bottom-[-350px] left-[150px] w-[600px] h-[600px] bg-blue-300 rounded-full"></div>
        <div className="z-10 text-left ml-[15%] mr-8">
          <h1 className="text-6xl font-bold text-black mb-4">place to learn</h1>
          <h1 className="text-6xl font-bold text-orange-500 mb-16">coding</h1>
          <Image src="/code.svg" alt="Coding" width={500} height={300} />
        </div>
      </div>
      {/*right side*/}
      <div className="flex w-2/5 items-center justify-center bg-white">
        <LogInForm />
      </div>
    </div>
  );
}
