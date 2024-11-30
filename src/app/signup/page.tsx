import SignUpForm from "@/app/component/signUpForm";

export default function SignUp() {
  return (
    <div className="flex h-full flex-row">
      <div className={"flex w-3/5 items-center justify-center bg-black"}>
        something
      </div>
      <div className="flex w-2/5 items-center justify-center bg-white">
        <SignUpForm />
      </div>
    </div>
  );
}
