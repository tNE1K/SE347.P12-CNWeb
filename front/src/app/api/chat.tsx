import axios from "axios";

const API_URL = `http://127.0.0.1:5000/chat`;

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


