import axios from "axios";

export const RegisterHelper = async (method, url, postData) => {
  try {
    const response = await axios({
      method: method,
      url: process.env.REACT_APP_API_URL + url,
      data: postData,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
