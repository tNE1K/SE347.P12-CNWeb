"use client";
import React from "react";
import { useState } from "react";
import { useAuth } from "@/app/component/authProvider";

export default function LogIn() {
  const { login } = useAuth(); // Import the login function
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // Attempt login
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-full flex-row">
      <div className={"flex w-3/5 items-center justify-center bg-black"}>
        something
      </div>
      <div className="flex w-2/5 items-center justify-center bg-white">
        <form
          className="flex h-fit w-2/3 flex-col items-center justify-center"
          onSubmit={handleSubmit} // Attach the submit handler
        >
          <div className="h-fit select-none py-4 font-sans text-6xl font-bold text-black mb-8">
            pro<span className="text-blue-600">c</span>ode
          </div>

          <div className="mb-4 w-full space-y-4">
            <label className="flex w-full justify-start font-semibold">
              Email
            </label>
            <input
              type="email"
              className="h-12 w-full rounded-md pl-4 outline outline-2"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              required
            />
          </div>
          <div className="mb-4 w-full space-y-4">
            <label className="flex w-full justify-start font-semibold">
              Password
            </label>
            <input
              type="password"
              className="h-12 w-full rounded-md pl-4 outline outline-2"
              placeholder="Input your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required
            />
          </div>
          <div className="mb-4 flex w-full flex-row justify-end">
            <a
              className="font-bold text-blue-500 hover:cursor-pointer hover:text-blue-700"
              href="./forgot"
            >
              Forgot password?
            </a>
          </div>
          <input
            type="submit"
            className="h-10 w-full font-bold rounded-full bg-blue-500 text-white transition-all hover:bg-blue-700"
            value="Log in"
          />
          <div className="mt-2 flex h-full w-full flex-row justify-start">
            <div>Don't have an account?</div>
            <a
              className="font-bold text-blue-500 hover:cursor-pointer hover:text-blue-700 ml-2"
              href="./signup"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}