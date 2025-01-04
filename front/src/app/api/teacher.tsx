import axios from "axios";

export async function sendVerifyDocument(
  formData: FormData,
  handleClose: () => void,
) {
  try {
    const response = await axios.post(
      `${process.env.MY_API_URL}/user/upload-verify-documents/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );
    alert("Files uploaded successfully!");
    console.log(response.data);
    handleClose();
  } catch (error) {
    console.error("Error uploading files:", error);
    alert("Failed to upload files. Please try again.");
  }
}
