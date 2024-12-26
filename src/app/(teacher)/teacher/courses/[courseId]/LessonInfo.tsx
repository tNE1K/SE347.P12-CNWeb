"use client";
import { ICourse, UpdateCoursePayload } from "@/app/types/course";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ILesson } from "@/app/types/lesson";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "@/app/api/course";
import { toast } from "react-toastify";
import LessonDetail from "./LessonDetail";
export default function LessonInfo({ course }: { course: ICourse }) {
  const lessonsRes = course?.lessonIds || [];
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const queryClient = useQueryClient();
  const [lessonSlt, setLessonSlt] = useState("");
  const { mutate } = useMutation({
    mutationFn: (newCourseData: UpdateCoursePayload) => {
      return updateCourse(newCourseData);
    },
    onSuccess: () => {
      toast.success("Update course successfully!");

      queryClient.invalidateQueries({
        queryKey: ["course-detail"],
      });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error?.message || "Something went wrong"}`);
    },
  });
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = lessons.findIndex((lesson) => lesson._id === active.id);
      const newIndex = lessons.findIndex((lesson) => lesson._id === over.id);
      const newArr = arrayMove(lessons, oldIndex, newIndex);
      const newArrIds = newArr.map((arr, idx) => arr._id);
      handleUpdateCourse(newArrIds);
      setLessons(newArr);
    }
  };
  const handleUpdateCourse = (lessonIds: string[]) => {
    mutate({
      courseId: course._id,
      data: {
        lessonIds: lessonIds,
      },
    });
  };
  useEffect(() => {
    if (lessonsRes) {
      setLessons(lessonsRes);
    }
  }, [lessonsRes]);
  return (
    <div>
      <div className="mb-4 flex w-full items-center justify-between">
        <p className="text-lg font-bold">Curriculum</p>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ textTransform: "none" }}
          onClick={() => {}}
          className=""
        >
          Add lesson
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="basis-[25%]">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={lessons.map((lesson) => lesson._id)}
              strategy={verticalListSortingStrategy}
            >
              {lessons.map((lesson, id) => {
                return (
                  <LessonRow
                    key={lesson._id}
                    setLessonSlt={setLessonSlt}
                    lessonSlt={lessonSlt}
                    lesson={lesson}
                  ></LessonRow>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
        <div className="basis-[75%]">
          {lessonSlt && (
            <LessonDetail
              lesson={{
                ...lessons[
                  lessons.findIndex((lesson) => lesson._id === lessonSlt)
                ],
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
const LessonRow = ({
  setLessonSlt,
  lessonSlt,
  lesson,
}: {
  setLessonSlt: (id: string) => void;
  lesson: ILesson;
  lessonSlt: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson._id });
  const headerProps = {
    ...listeners,
    className: "drag-handle cursor-grab",
  };
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...headerProps}
      style={style}
      onClick={() => setLessonSlt(lesson._id)}
      className={`${lessonSlt === lesson._id && "bg-gray-200"} mt-2 flex cursor-pointer items-center gap-4 rounded-lg px-2 py-2 transition-all hover:bg-gray-200`}
    >
      <MenuIcon />
      <div className="flex flex-col">
        <p className="font-semibold">{lesson.title}</p>
        <p className="line-clamp-1 text-sm text-gray-400">
          {lesson.description}
        </p>
      </div>
    </div>
  );
};
