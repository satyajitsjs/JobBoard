import axios from "axios";

const JbApi = async (method, url, token, postData = null) => {
  try {
    const response = await axios({
      method: method,
      url: process.env.REACT_APP_API_URL + url,
      data: postData, // If you need to send data in POST or PUT requests
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // If you need to send an authentication token
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export default JbApi;
