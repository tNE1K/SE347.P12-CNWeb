import SignUpForm from "@/app/component/signUpForm";
import Image from "next/image";

export default function SignUp() {
  return (
    <div className="flex min-h-[100vh] flex-row">
      <div className="relative flex min-h-[100vh] w-3/5 items-center overflow-hidden bg-blue-100">
        <div className="absolute left-[-200px] top-[0px] h-[300px] w-[300px] rounded-full bg-red-300"></div>
        <div className="absolute right-[-300px] top-[-200px] h-[600px] w-[600px] rounded-full bg-green-200"></div>
        <div className="absolute bottom-[-350px] left-[150px] h-[600px] w-[600px] rounded-full bg-blue-300"></div>
        <div className="z-10 ml-[15%] mr-8 text-left">
          <h1 className="mb-4 text-6xl font-bold text-black">place to learn</h1>
          <h1 className="mb-16 text-6xl font-bold text-orange-500">coding</h1>
          <Image src="/code.svg" alt="Coding" width={500} height={300} />
        </div>
      </div>
      <div className="flex w-2/5 items-center justify-center bg-white">
        <SignUpForm />
      </div>
    </div>
  );
}
