"use client";
import Rating from "@/app/(teacher)/components/RatingBar/Rating";
import { IComment } from "@/app/types/comment";
import { convertISOToDate } from "@/app/utils/coverter";

import React, { useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { replyComment, ReplyCommentPayload } from "@/app/api/comments";
import { useAuth } from "@/app/component/authProvider";
export default function CommentSection({ comments }: { comments: IComment[] }) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {comments.map((comment, idx) => (
          <CommentRow key={idx} comment={comment} />
        ))}
        {comments.length === 0 && (
          <div className="flex justify-center">
            There are currently no comments on this lesson.
          </div>
        )}
      </div>
    </div>
  );
}
export const CommentRow = ({ comment }: { comment: IComment }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showInputReply, setShowInputReply] = useState(false);
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const replies = comment?.replyIds || [];
  const { user, courseSlt } = useAuth();
  const { mutate } = useMutation({
    mutationFn: (payload: ReplyCommentPayload) => {
      return replyComment(payload);
    },
    onSuccess: () => {
      toast.success("Reply comment successfully!");
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error?.message || "Something went wrong"}`);
    },
  });
  const handleReplyCommment = async (commentId: string) => {
    // TODO HANDLE ERROROROROROROROR
    if (!user?.id || content.trim() === "") return;
    mutate({
      comment_id: commentId,
      data: {
        content: content,
        user_id: user.id,
      },
    });
    setShowInputReply(false);
    setShowReplies(true);
    setContent("");
  };
  const isTeacher = courseSlt?.teacher_id === comment.user_id;
  return (
    <div>
      <div className="flex gap-4">
        <div
          className="h-[50px] w-[50px] rounded-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745)`,
          }}
        ></div>
        <div className="w-full">
          <div className="w-full rounded-lg border-[1px] bg-white px-4 py-2">
            <div className="flex items-center gap-2">
              <p className={`${isTeacher && "text-blue-500"} font-bold`}>
                {comment.user_info.fullName}
              </p>
              <div className="mb-[2px]">
                <Rating className="text-base" rating={comment.rating} />
              </div>
              <p className="text-sm">{comment?.rating || 0}/5</p>
            </div>
            <p>{comment.content}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500">
                {convertISOToDate(comment.createdAt)}
              </p>
              <p
                onClick={() => setShowInputReply(true)}
                className="cursor-pointer text-xs text-gray-500 underline"
              >
                Reply
              </p>
            </div>
          </div>
          {showReplies && (
            <div className="mt-2 flex flex-col gap-2 transition-all">
              {replies.map((el, id) => {
                const isTeacherReply = courseSlt?.teacher_id === el.user_id;
                return (
                  <div key={id} className="flex gap-2">
                    <div
                      className="h-[30px] w-[30px] rounded-full bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745)`,
                      }}
                    ></div>
                    <div className="w-full rounded-lg border-[1px] bg-white px-4 py-2">
                      <p
                        className={`${isTeacherReply && "text-blue-500"} font-bold`}
                      >
                        {el.user_info.fullName}{" "}
                        {isTeacherReply && <>(Teacher)</>}
                      </p>
                      <p>{el.content}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {convertISOToDate(el.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {comment.replyIds.length > 0 && (
            <div
              onClick={() => setShowReplies((prev) => !prev)}
              className="ml-2 mt-2 flex cursor-pointer items-center gap-1 text-sm font-semibold text-gray-600 underline transition-all"
            >
              <p>{showReplies ? "Hide" : "Show replies comment"}</p>
              {showReplies ? (
                <ArrowUpwardIcon className="text-sm" />
              ) : (
                <ArrowDownwardIcon className="text-sm" />
              )}
            </div>
          )}
          {showInputReply && (
            <div className="p-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Reply now..."
                className="my-2 mb-0 w-full rounded-md border-[1px] px-2 py-2"
              />
              <div className="flex justify-end gap-4">
                <div
                  onClick={() => setShowInputReply(false)}
                  className="cursor-pointer rounded-md bg-gray-300 px-4 py-2 text-sm text-black transition-all hover:bg-gray-400"
                >
                  Cancel
                </div>
                <div
                  onClick={() => handleReplyCommment(comment._id)}
                  className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-all hover:bg-blue-700"
                >
                  Reply now
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
