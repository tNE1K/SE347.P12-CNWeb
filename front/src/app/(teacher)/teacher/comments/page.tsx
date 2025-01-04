"use client"
import { RoleCheck } from "@/app/component/roleCheck";
import CommentPage from "./CommentPage";

export function CommentPages() {
  return (
    <div className="min-h-[120vh] p-6">
      <CommentPage />
    </div>
  );
}

export default RoleCheck(CommentPages, "teacher")