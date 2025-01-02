import { useRouter } from "next/navigation";

export default function Logo() {
    const router = useRouter();
    return(
        <div
          onClick={() => {
            router.push('/');
          }}
          className="h-full select-none place-content-center pl-8 font-sans text-3xl font-bold text-black hover:cursor-pointer"
        >
          pro<span className="text-blue-600">c</span>ode
        </div>
    )

}