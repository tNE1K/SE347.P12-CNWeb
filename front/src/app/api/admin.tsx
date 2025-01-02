import axios from "axios";

export const fetchAllUser = async () => {
  try {
    const response = await axios.get(`${process.env.MY_API_URL}/admin/get_all_user`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    localStorage.clear();
    throw error;
  }
};

export const fetchAllTeacherRequest = async () => {
  try {
    const response = await axios.get(`${process.env.MY_API_URL}/admin/get_teacher_request`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch teacher request data:", error);
    localStorage.clear();
    throw error;
  }
};

export const findUser = async (token: any, str: string) => {
  try {
    const response = await axios.get(`${process.env.MY_API_URL}/admin/find_user`, {
      withCredentials: true,
      params: {
        search: str
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    localStorage.clear();
    throw error;
  }
};

export const fetchAllCourse = async (token: any) => {
  try {
    const response = await axios.get(`${process.env.MY_API_URL}/admin/get_all_course`, {
      withCredentials: true
    });
    console.log("Course Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    throw error;
  }
};
