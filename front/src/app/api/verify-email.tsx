import axios from "axios";

export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.MY_API_URL}/auth/verify-email?token=${token}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};
