import React from "react";
import NavBar from "@/app/component/navBar";

export default function UserLayout({
                                     children
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <NavBar />
      {children}
    </section>
  );
}
