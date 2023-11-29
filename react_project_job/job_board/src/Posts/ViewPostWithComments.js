import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteConfirmation from "../Helper/DeleteConfirmation";
import JbApi from "../Helper/JbApi";

export default function ViewPostWithComments() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  const token = localStorage.getItem("user-token");
  const userInfo = JSON.parse(localStorage.getItem("user-info"));

  const handleEditComment = (commentId, editedContent) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(editedContent);
  };

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleReply = (commentId) => {
    setReplyingToCommentId(commentId);
    setReplyContent("");
  };

  const handleReplyChange = (e, parentId = null) => {
    if (parentId !== null) {
      setReplyContent((prevReplyContent) => ({
        ...prevReplyContent,
        [parentId]: e.target.value,
      }));
    } else {
      setNewComment(e.target.value);
    }
  };

  const fetchPostData = async () => {
    const response = await JbApi("GET", `/posts/${id}`, token);

    if (!response.data) {
      throw new Error("Post not found");
    }

    setPost(response.data?.posts);
  };

  const fetchComments = async () => {
    const response = await JbApi("GET", `/post/${id}/comments`, token);
    setComments(response.data?.Posts?.comments || []); // Change this line
  };

  useEffect(() => {
    fetchPostData();
    fetchComments();
  }, [id, token]);

  const handleSubmitComment = async (parentId = null) => {
    if ((parentId && !replyContent[parentId]) || (!parentId && !newComment)) {
      toast.error("Commeent cannot be blank", {
        position: "top-center",
      });
      return;
    }
    const item = {
      content: parentId ? replyContent[parentId] : newComment,
      post_id: id,
      user_id: userInfo.user_id,
      parent_id: parentId || replyingToCommentId,
    };

    const response = await JbApi("POST", "/comment", token, item);

    if (response.status === 201) {
      const newCommentData = response.data?.comment;
      setComments((newComment) => [...newComment, newCommentData]);
      setNewComment("");
      setReplyingToCommentId(null);
      toast.success("Comment Added SuccessFully");
      fetchComments();
    } else {
      console.error("Error creating comment");
    }
  };

  const handleDelete = (commentid) => {
    toast.info(
      <DeleteConfirmation
        fetchData={fetchComments}
        url={`/comment/${commentid}`}
        token={token}
      />,
      {
        position: "top-right",
      }
    );
  };

  const handleSaveComment = async (commentId) => {
    const item = {
      content: editedCommentContent,
      post_id: id,
      user_id: userInfo.user_id,
    };
    const response = await JbApi("PUT", `/comment/${commentId}`, token, item);
    if (response.status === 200) {
      const editedCommentData = response.data?.comment;
      setComments((prevComments) => {
        return prevComments.map((comment) =>
          comment.id === editedCommentData.id ? editedCommentData : comment
        );
      });
      setEditingCommentId(null);
      fetchComments();
    } else {
      console.error("Error editing comment");
    }
  };

  const renderComments = (parentId = null) => {
    const parentComments = comments.filter(
      (comment) => comment.parent_id === parentId
    );

    if (parentComments.length === 0) return null;

    return (
      <div className="ml-4 mt-2 ">
        {parentComments.map((comment) => (
          <div
            key={comment.id}
            style={{
              marginLeft: "2px",
            }}
          >
            <hr
              style={{
                color: "black",
              }}
            />
            {comment.user && <p>User Name: {comment.user.name}</p>}
            {editingCommentId === comment.id ? (
              <div>
                <input
                  type="text"
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                  className="border p-2 mt-2"
                />
                {userInfo && userInfo.user_id === comment.user.id && (
                  <button
                    onClick={() => handleSaveComment(comment.id)}
                    className="bg-green-500 text-white px-2 py-2 rounded"
                  >
                    Save
                  </button>
                )}
              </div>
            ) : (
              <p>Content: {comment.content}</p>
            )}
            <div className="relative ...">
              {renderComments(comment.id)}
              <button onClick={() => handleReply(comment.id)} className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
                <span> Replay </span>
              </button>
              <div className="flex place-content-end">
                {userInfo && userInfo.user_id === comment.user_id && (
                  <>
                    <button
                      onClick={() =>
                        handleEditComment(comment.id, comment.content)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(comment.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section>
        <Navbar />
      </section>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          className="bg-[#E2D1F9] shadow-lg rounded-lg p-4 mt-2"
          style={{
            justifyContent: "center",
            justifyItems: "center",
            width: "55%",
          }}
        >
          {post && (
            <>
              <h1
                className="text-2xl font-bold mb-2"
                style={{
                  textAlign: "left",
                  justifyContent: "left",
                }}
              >
                {post.title}
              </h1>

              <img
                src={`http://localhost:8000/storage/images/${post.image_path}`}
                alt={post.image_path}
                className="img-fluid object-cover rounded-lg"
                style={{
                  width: "full",
                  height: "full",
                }}
              />
              <p className="mb-4">{post.content}</p>
              <p className="text-gray-500 mb-2">
                <span className="font-bold">Slug:</span> {post.slug}
              </p>
              {post.user && (
                <p className="text-gray-500 mb-2">
                  <span className="font-bold">User Name:</span> {post.user.name}
                </p>
              )}
              <p className="text-gray-500 mb-2">
                <span className="font-bold">Status:</span> {post.status}
              </p>
            </>
          )}
        </div>
        <div
          style={{
            width: "45%",
            justifyContent: "left",
            textAlign: "left",
            marginRight: "2px",
            paddingLeft: "20px",
          }}
          className="bg-[#E2D1F9] shadow-lg rounded-lg p-4 mt-2"
        >
          <h2 className="text-lg font-bold">
            {replyingToCommentId ? "Reply" : "Add a Comment"}
          </h2>
          <input
            type="text"
            value={
              replyingToCommentId
                ? replyContent[replyingToCommentId] || ""
                : newComment
            }
            onChange={(e) =>
              replyingToCommentId
                ? handleReplyChange(e, replyingToCommentId)
                : handleNewCommentChange(e)
            }
            placeholder={
              replyingToCommentId
                ? `reply to ${
                    comments.find(
                      (comment) => comment.id === replyingToCommentId
                    )?.user?.name
                  }'s comment...`
                : "Write your comment..."
            }
            className="border-black p-2 flex-1 mb-2"
          />
          <button
            onClick={() =>
              replyingToCommentId
                ? handleSubmitComment(replyingToCommentId)
                : handleSubmitComment()
            }
            className="bg-[#338573] text-white px-6 py-3 rounded-lg hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors duration-200"
          >
            {replyingToCommentId ? "Reply" : "Add Comment"}
          </button>
          <div style={{}}>
            {comments.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-bold">Comments</h2>
                {renderComments()}
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <Footer />
      </section>
    </>
  );
}
