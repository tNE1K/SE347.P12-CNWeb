"use client";
import Rating from "@/app/(teacher)/components/RatingBar/Rating";
import RatingPicker from "@/app/(teacher)/components/RatingBar/RatingPicker";
import { IComment } from "@/app/types/comment";
import { convertISOToDate } from "@/app/utils/coverter";
import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
export default function CommentSection({ comments }: { comments: IComment[] }) {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <div className="my-4 text-2xl font-bold">Comments</div>
      <div className="flex gap-4">
        <div
          className="h-[50px] w-[50px] rounded-full bg-contain bg-center"
          style={{
            backgroundImage: `url(https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745)`,
          }}
        ></div>
        <div className="flex flex-1 flex-col gap-2">
          <RatingPicker rating={rating} setRating={setRating} />
          <TextField
            id="outlined-basic"
            label="Enter comment"
            variant="outlined"
            fullWidth
            multiline={true}
            rows={3}
          />
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <Button variant="contained" autoFocus className="">
          Comments
        </Button>
      </div>
      <div className="my-4 h-[0.5px] w-full bg-gray-400"></div>
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
  const replies = comment?.replyIds || [];
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
              <p className="font-bold">{comment.user_info.fullName}</p>
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
            </div>
          </div>
          {showReplies && (
            <div className="mt-2 flex flex-col gap-2 transition-all">
              {replies.map((el, id) => {
                return (
                  <div key={id} className="flex gap-2">
                    <div
                      className="h-[30px] w-[30px] rounded-full bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745)`,
                      }}
                    ></div>
                    <div className="w-full rounded-lg border-[1px] bg-white px-4 py-2">
                      <p className="font-bold">{el.user_info.fullName}</p>
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
        </div>
      </div>
    </div>
  );
};
