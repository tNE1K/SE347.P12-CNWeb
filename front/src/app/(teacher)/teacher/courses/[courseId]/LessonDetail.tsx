"use client";
import { ILesson } from "@/app/types/lesson";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LessonResource, { ELessonType } from "./LessonResource";
import CustomDialog from "../components/CustomDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLesson } from "@/app/api/lesson";
import { toast } from "react-toastify";
export interface UpdateLessonPayloadDto {
  title: string;
  description: string;
  type: string;
}
export default function LessonDetail({
  lesson,
  setLessonSlt,
}: {
  lesson: ILesson;
  setLessonSlt: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [lessonTitle, setLessonTitle] = useState("");
  const [error, setError] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [showDeleteLesson, setShowDeleteLesson] = useState(false);
  const [typeLesson, setTypeLesson] = useState<ELessonType>(ELessonType.Video);
  const [updatePayload, setUpdatePayload] = useState<
    UpdateLessonPayloadDto | undefined
  >(undefined);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (courseId: string) => {
      return deleteLesson(courseId);
    },
    onSuccess: () => {
      toast.success("Delete lesson successfully!");

      queryClient.invalidateQueries({
        queryKey: ["course-detail"],
      });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error?.message || "Something went wrong"}`);
    },
  });
  const handleChange = (event: SelectChangeEvent<ELessonType>) => {
    setTypeLesson(event.target.value as ELessonType);
  };
  const validateInput = () => {
    if (lessonTitle.trim() === "") {
      setError("Please enter name course");
      return true;
    }
    return false;
  };
  const handleDeleteLesson = () => {
    mutate(lesson._id);
    setLessonSlt("");
  };
  useEffect(() => {
    if (lesson) {
      if (lesson.type === "video") setTypeLesson(ELessonType.Video);
      if (lesson.type === "testselection") setTypeLesson(ELessonType.Selection);
      if (lesson.type === "scriptlesson") setTypeLesson(ELessonType.CodeScript);
      setLessonTitle(lesson.title);
      setLessonDescription(lesson.description);
    }
  }, [lesson]);
  useEffect(() => {
    if (lessonTitle && lessonDescription && typeLesson) {
      let type = "";
      if (typeLesson === ELessonType.Video) type = "video";
      if (typeLesson === ELessonType.CodeScript) type = "scriptlesson";
      if (typeLesson === ELessonType.Selection) type = "testselection";
      setUpdatePayload({
        title: lessonTitle,
        description: lessonDescription,
        type: type,
      });
    }
  }, [lessonTitle, lessonDescription, typeLesson]);

  return (
    <div className="flex w-full flex-col space-y-4 rounded-md border-[1px] border-gray-300 p-7">
      <div className="flex w-full justify-end">
        <Button
          variant="contained"
          autoFocus
          onClick={() => {
            setShowDeleteLesson(true);
          }}
          color="error"
          // onClick={handleSaveLesson}
          className="my-4 w-[150px]"
        >
          Delete
        </Button>
      </div>
      <div className="flex flex-col">
        <TextField
          label="Lesson title"
          name="title"
          value={lessonTitle}
          onChange={(e) => {
            setLessonTitle(e.target.value);
            setError("");
          }}
          multiline
          required
          error={error !== ""}
        />
        {error !== "" && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
      <TextField
        label="Lesson description"
        name="description"
        value={lessonDescription}
        onChange={(e) => setLessonDescription(e.target.value)}
        multiline
        required
      />
      <div className="w-2/3 md:w-1/3">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" required>
            Type of lesson
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={typeLesson}
            label="Type of lesson"
            onChange={handleChange}
            required
          >
            <MenuItem value={ELessonType.Video}>Video</MenuItem>
            <MenuItem value={ELessonType.Selection}>Selection</MenuItem>
            <MenuItem value={ELessonType.CodeScript}>Code script</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Divider />
      {updatePayload && (
        <LessonResource
          type={typeLesson}
          iniLesson={lesson}
          validateInput={validateInput}
          updatePayload={updatePayload}
        />
      )}
      {/* <Button
        variant="contained"
        autoFocus
        // onClick={handleSaveLesson}
        className=""
      >
        Save
      </Button> */}
      <CustomDialog
        open={showDeleteLesson}
        onClose={() => {
          setShowDeleteLesson(false);
        }}
        onYes={() => {
          handleDeleteLesson();
        }}
        title="Are you sure want to delete this lesson"
        desc="All resource in this lesson will be deleted"
      />
    </div>
  );
}
