"use client";

import { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  return (
    <div className="flex h-full flex-row">
      <div className={"flex w-3/5 items-center justify-center bg-black"}>something</div>
      <div className="flex w-2/5 items-center justify-center bg-white">
        <form
          className="flex h-fit w-2/3 flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the default form submission behavior.

            if (password !== confirmPassword) {
              alert("Passwords do not match!");
              return;
            }

            // Send signup request to the backend
            axios.post("http://localhost:5000/auth/signup", {
              email,
              password,
              // confirmPassword,
            })
              .then((response) => {
                alert("Account created successfully!");
                window.location.href = "./login"; // Redirect to login page.
              })
              .catch((error) => {
                alert(`Error: ${error.response?.data?.message || "Signup failed."}`);
              });
          }}
        >
          <div className="h-fit select-none py-4 font-sans text-6xl font-bold text-black mb-8">
            pro<span className="text-blue-600">c</span>ode
          </div>
          {/*  */}
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
            ></input>
          </div>
          {/*  */}
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
            ></input>
          </div>

          <div className="mb-4 w-full space-y-4">
            <label className="flex w-full justify-start font-semibold">
              Confirm password
            </label>
            <input
              type="password"
              className="h-12 w-full rounded-md pl-4 outline outline-2"
              placeholder="Input your password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="password"
              required
            ></input>
          </div>

          <input
            type="submit"
            className="h-10 w-full font-bold rounded-full bg-blue-500 text-white transition-all hover:bg-blue-700 "
            value="Sign up"
          ></input>

          <div className="mt-2 flex h-full w-full flex-row justify-start">
            <div>Already have an account?</div>
            <a
              className="font-bold text-blue-500 hover:cursor-pointer hover:text-blue-700 ml-2"
              href="./login"
            >
              Log in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
