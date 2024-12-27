"use client";

import { ILesson, IVideoLesson } from "@/app/types/lesson";
import AddIcon from "@mui/icons-material/Add";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Button from "@mui/material/Button";
import { memo, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { UpdateLessonPayloadDto } from "./LessonDetail";
import useUpdateLesson from "@/app/hooks/useUpdateLesson";
import { uploadImage } from "@/app/api/course";
import SelectionBox, {
  ESelectionAnswerChoiceList,
  TSelectionLessonResourse,
} from "./SelectionBox";
import { createTestSelections } from "@/app/api/lesson";

export enum ELessonType {
  Video = "Video",
  CodeScript = "CodeScript",
  Selection = "Selection",
}
interface IEditLessonResource {
  type: ELessonType;
  iniLesson: ILesson;
  validateInput: () => boolean;
  updatePayload: UpdateLessonPayloadDto;
}

function EditLessonResource({
  type,
  iniLesson,
  validateInput,
  updatePayload,
  ...res
}: IEditLessonResource) {
  switch (type) {
    case ELessonType.Video:
      return (
        <EditVideoLesson
          iniLesson={iniLesson}
          validateInput={validateInput}
          updatePayload={updatePayload}
        />
      );
    // case ELessonType.CodeScript:
    //   return <EditCodeScriptLesson {...res} />;
    case ELessonType.Selection:
      return <EditSelectionLesson iniLesson={iniLesson} {...res} />;
    default:
      return <></>;
  }
}

export default memo(EditLessonResource);

function EditVideoLesson({
  iniLesson,
  validateInput,
  updatePayload,
}: {
  iniLesson: ILesson;
  validateInput: () => boolean;
  updatePayload: UpdateLessonPayloadDto;
}) {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const { mutate } = useUpdateLesson();
  const videoSrcRef = useRef<string>(
    (iniLesson?.resource[0] as IVideoLesson)?.file || "",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSaveLesson = async () => {
    const isError = validateInput();
    if (isError) return;
    let imgSrc = "";
    if (selectedVideo) {
      const res = await uploadImage(selectedVideo);
      imgSrc = res?.file_url;
    }
    const formData = new FormData();
    formData.append("title", updatePayload.title);
    formData.append("description", updatePayload.description);
    if (imgSrc) {
      formData.append("type", updatePayload.type);
      formData.append("file", imgSrc);
      formData.append("duration", "3");
    }
    mutate({
      lessonId: iniLesson._id,
      data: formData,
    });
  };
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (selectedVideo) {
      URL.revokeObjectURL(videoSrcRef.current as string);
    }

    if (files) {
      const file = files[0];
      setSelectedVideo(file);
      videoSrcRef.current = URL.createObjectURL(file);
    }
  };
  useEffect(() => {
    if ((iniLesson?.resource[0] as IVideoLesson)?.file) {
      videoSrcRef.current = (iniLesson?.resource[0] as IVideoLesson)?.file;
    }
  }, [iniLesson, videoSrcRef]);
  return (
    <div className="space-y-5 text-sm text-gray-500">
      <input
        type="file"
        accept="video/mp4"
        onChange={handleVideoUpload}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <Button
        variant="outlined"
        startIcon={<FileUploadOutlinedIcon />}
        size="small"
        sx={{ textTransform: "none" }}
        onClick={() => fileInputRef.current?.click()}
      >
        Upload lesson video
      </Button>
      {selectedVideo && (
        <div>
          <span>{selectedVideo.name}</span>
        </div>
      )}

      {videoSrcRef && (
        <ReactPlayer
          controls
          url={videoSrcRef.current}
          className="mx-auto aspect-video"
        />
      )}
      <Button
        variant="contained"
        autoFocus
        onClick={handleSaveLesson}
        className="w-full"
      >
        Save
      </Button>
    </div>
  );
}
const initialSelection = {
  question: "",
  explanation: "",
  answerA: "",
  answerB: "",
  answerC: "",
  answerD: "",
  correctAnswer: ESelectionAnswerChoiceList.A,
};
function EditSelectionLesson({ iniLesson }: { iniLesson: ILesson }) {
  const { mutate } = useUpdateLesson();
  const iniSelections = iniLesson?.resource || [];
  const onSave = async () => {
    const selectionIds = [];
    for (const selection of selections) {
      const formData = new FormData();
      formData.append("answerA", selection.answerA);
      formData.append("answerB", selection.answerB);
      formData.append("answerC", selection.answerC);
      formData.append("answerD", selection.answerD);
      formData.append("correctAnswer", selection.correctAnswer);
      formData.append("question", selection.question);
      formData.append("explanation", selection.explanation as string);
      // Append additional fields as needed

      const response = await createTestSelections(formData);
      selectionIds.push(response.id);
    }
    const form = new FormData();
    form.append("selectionIds", JSON.stringify(selectionIds));
    form.append("type", "testselection");
    mutate({
      lessonId: iniLesson._id,
      data: form,
    });
  };
  const [selections, setSelections] = useState<TSelectionLessonResourse[]>([]);
  useEffect(() => {
    if (iniSelections && iniSelections.length > 0) {
      setSelections(iniSelections as TSelectionLessonResourse[]);
    }
  }, [iniSelections]);
  return (
    <div>
      <div className="mb-5"></div>
      <div className="space-y-4">
        {selections.map((sl, idx) => (
          <SelectionBox
            key={idx + 1}
            setSelections={setSelections}
            {...sl}
            clickDelete={() => {
              const newSelections = selections.filter(
                (sel, index) => idx !== index,
              );
              setSelections(newSelections);
            }}
            id={idx + 1}
          />
        ))}
        <div className="flex w-full justify-center">
          <Button
            onClick={() => {
              setSelections((prev) => [...prev, initialSelection]);
            }}
            color="inherit"
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ textTransform: "none" }}
          >
            Add question
          </Button>
        </div>
        <div className="w-full">
          <Button
            variant="contained"
            size="small"
            onClick={onSave}
            className="w-full"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
// function EditCodeScriptLesson({
//   handleSubmit,
//   prevInformation,
//   isMutating,
// }: Omit<IEditLessonResource, "type">) {
//   const [isLoading, setIsLoading] = useState(false);

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleTextUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files) {
//       const file = files[0];
//       setSelectedFile(file);
//     }
//   };

//   const onSave = async () => {
//     if (selectedFile) {
//       try {
//         setIsLoading(true);
//         const text = await selectedFile.text();
//         const data = JSON.parse(text);

//         handleSubmit(data as TCodescriptLessonResourse[]);
//       } catch (err) {
//         toast("File is not in the correct format", {
//           type: "error",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col space-y-3 text-sm text-gray-500">
//       <input
//         type="file"
//         accept="application/JSON"
//         onChange={handleTextUpload}
//         style={{ display: "none" }}
//         ref={fileInputRef}
//       />

//       <span>
//         Upload the json file to create a list of test cases for the code script
//         lecture.
//       </span>
//       <span>
//         The json file must have the same content as the sample file below.
//       </span>
//       <div className="flex-col space-y-3">
//         <Button
//           startIcon={<SaveAltOutlinedIcon />}
//           size="small"
//           sx={{ textTransform: "none" }}
//           onClick={() => downloadFunc("/files/sample_testcase.json")}
//         >
//           download sample test case
//         </Button>
//         <br></br>
//         <Button
//           variant="outlined"
//           startIcon={<FileUploadOutlinedIcon />}
//           size="small"
//           sx={{ textTransform: "none" }}
//           onClick={() => fileInputRef.current?.click()}
//         >
//           Upload sample test case
//         </Button>
//       </div>
//       <span>file name</span>
//       <div>
//         <LoadingButtonProvider
//           className="w-fit"
//           isLoading={isMutating || isLoading}
//         >
//           <Button
//             disabled={!prevInformation || !selectedFile}
//             variant="contained"
//             size="small"
//             onClick={onSave}
//           >
//             Save
//           </Button>
//         </LoadingButtonProvider>
//       </div>
//     </div>
//   );
// }
