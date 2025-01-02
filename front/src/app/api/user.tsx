import axios from "axios";

export const fetchInfo = async () => {
  try {
    const response = await axios.get(`"${process.env.MY_API_URL}/auth/me"`, {
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
    const response = await axios.get(`"${process.env.MY_API_URL}/user/me"`, {
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
    const response = await axios.get(`"${process.env.MY_API_URL}/user/course"`, {
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
    const response = await axios.post(`"${process.env.MY_API_URL}/user/update"`, {
      updateData,
      email,
    },{withCredentials: true,});
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};
