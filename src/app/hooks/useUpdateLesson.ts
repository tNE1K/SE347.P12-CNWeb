import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateLesson } from "../api/lesson";
export type UpdateLessonBody = {
  lessonId: string;
  data: FormData;
};
const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newLessonData: UpdateLessonBody) => {
      return updateLesson(newLessonData);
    },
    onSuccess: () => {
      toast.success("Update lesson successfully!");
      queryClient.invalidateQueries({
        queryKey: ["course-detail"],
      });
    },
    onError: (error: any) => {
      toast.error(`Error: ${error?.message || "Something went wrong"}`);
    },
  });
  return mutation;
};
export default useUpdateLesson;
