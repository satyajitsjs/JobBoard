import React, { useState } from "react";
import { toast } from "react-toastify";
import JbApi from "./JbApi";

const DeleteConfirmation = ({ fetchData, url, token }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    toast.dismiss();

    try {
      const response = await JbApi("DELETE", url, token);

      if (response) {
        toast.success("Deleted Successfully");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    toast.dismiss();
  };

  return (
    <div>
      {isDeleting ? (
        <span>Deleting...</span>
      ) : (
        <>
          <span>Do you want to delete?</span>
          <button
            onClick={handleConfirm}
            className="text-red-500 underline hover:text-red-700 focus:outline-none"
          >
            Confirm
          </button>
          <button
            onClick={handleCancel}
            className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default DeleteConfirmation;
