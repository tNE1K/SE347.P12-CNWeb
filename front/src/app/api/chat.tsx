import axios from "axios";

const API_URL = `${process.env.MY_API_URL}/chat`;

export const fetchInfo = async () => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching user info:", error);
    throw error;
  }
};
