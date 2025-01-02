import axios from "axios";

export const fetchInfo = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:5000/auth/me", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching user info:", error);
    throw error;
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await axios.get("http://localhost:5000/user/me", {
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
    const response = await axios.get("http://127.0.0.1:5000/user/course", {
      withCredentials: true,
    });
    console.log("User Data:", response.data);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

export const updateInfo = async (updateData : any, email: any) => {
  try {
    console.log(updateData)
    const response = await axios.post("http://localhost:5000/user/update", {
      updateData,
      email,
    },{withCredentials: true,});
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};
