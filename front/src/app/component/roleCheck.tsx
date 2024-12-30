"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { fetchInfo } from "@/app/api/user";

export const RoleCheck = (
  Component: React.ComponentType,
  allowedRole: string
) => {
  return function RoleGuardedComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      const checkRole = async () => {
        try {
          const response = await fetchInfo();
          if (response) {
            const { role } = response;
            if (role !== allowedRole) {
              router.replace("/");
            }
          } else {
            router.replace("/");
          }
        } catch (error) {
          router.replace("/");
        }
      };
      void checkRole();
    }, [router]);

    return <Component {...props} />;
  };
};
