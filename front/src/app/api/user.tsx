import axios from "axios";

const API_URL = "http://localhost:5000/user";
export const fetchInfo = async () => {
  try {
    const response = await axios.get("http://localhost:5000/auth/me", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching user info:", error);
    throw error;
  }
};

export const fetchCourse = async () => {
  try {
    const response = await axios.get("http://localhost:5000/user/course", {
      withCredentials: true,
    });
    console.log("User Data:", response.data);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

export const changeInfo = async () => {};
