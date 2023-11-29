import { toast } from "react-toastify";

export const emailValidation = (email) => {
  const regEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    toast.error("Email cannot be blank", {
      position: "top-center",
    });
    return false;
  }
  if (!regEx.test(email)) {
    toast.error("Email is not valid", {
      position: "top-center",
    });
    return false;
  }
  return true;
};

export const passwordValidation = (password) => {
  if (!password) {
    toast.error("Password cannot be blank!", {
      position: "top-center",
    });
    return false;
  }

  if (password.length < 8) {
    toast.error(
      "Please enter a valid Password with a minimum of 8 characters",
      {
        position: "top-center",
      }
    );
    return false;
  }

  return true;
};

export const nameValidation = (name) => {
  if (!name) {
    toast.error("Name cannot be blank", {
      position: "top-center",
    });
    return false;
  }
  return true;
};
