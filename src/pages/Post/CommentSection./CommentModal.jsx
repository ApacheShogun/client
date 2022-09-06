import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const CommentModal = ({
  setToggleCommentModal,
  setToCommentDelete,
  setToCommentEdit,
  toCommentDelete,
  toCommentEdit,
  commentId,
  commentText,
  setAllComments,
}) => {
  const { user } = useAuthContext();
  const [commentLoading, setCommentLoading] = useState(false);
  const navigate = useNavigate();

  const initialvalues = {
    commentText: commentText,
    commentImg: "",
  };

  const validationSchema = Yup.object().shape({
    commentText: Yup.string().max(140).required(),
    commentImg: Yup.mixed(),
  });

  // close the modal
  const closeModal = () => {
    setToggleCommentModal(false);
    setToCommentDelete(false);
    setToCommentEdit(false);
  };

  // delete comment
  const deleteComment = () => {
    setCommentLoading(true);

    axios
      .delete(`https://nebula-poster-backend.herokuapp.com/api/comment/${commentId}`, {
        headers: { jwtToken: user.token },
      })
      .then((res) => {
        console.log(res.data);
        setAllComments((prev) => prev.filter((c) => c.id !== commentId));
        setCommentLoading(false);
        closeModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // update comment
  const updateComment = (data) => {
    setCommentLoading(true);

    if (!user) {
      console.log("log in");
      return navigate("/login");
    }

    // if user makes a post with just text and without a image
    if (!data.commentImg) {
      axios
        .put(
          "https://nebula-poster-backend.herokuapp.com/api/comment",
          {
            id: commentId,
            commentText: data.commentText,
            commentImg: data.commentImg,
          },
          {
            headers: { jwtToken: user.token },
          }
        )
        .then((res) => {
          console.log(res.data);
          setCommentLoading(false);
          setAllComments((prev) =>
            prev.map((dehcomment) =>
              dehcomment.id === commentId
                ? { ...dehcomment, commentText: data.commentText }
                : dehcomment
            )
          );
          closeModal();
        })
        .catch((error) => {
          console.log(error.response.data.error);
        });
    } else {
      // if user includes a image with the post
      const formData = new FormData();
      formData.append("file", data.commentImg);
      formData.append("upload_preset", "jhpnjpgh");

      // send the postImg data to cloudinary
      axios
        .post("https://api.cloudinary.com/v1_1/dwfb3adcj/upload", formData)
        .then((res) => {
          // get back the image asset id from cloudary
          const fileName = res.data.public_id;

          // then send all the text and img asset id to the database
          axios
            .put(
              "https://nebula-poster-backend.herokuapp.com/api/comment",
              {
                id: commentId,
                commentText: data.commentText,
                commentImg: fileName,
              },
              {
                headers: { jwtToken: user.token },
              }
            )
            .then((res) => {
              console.log(res.data);
              setCommentLoading(false);
              setAllComments((prev) =>
                prev.map((dehcomment) =>
                  dehcomment.id === commentId
                    ? {
                        ...dehcomment,
                        commentText: data.commentText,
                        commentImg: fileName,
                      }
                    : dehcomment
                )
              );
              closeModal();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-btn-container">
        <AiOutlineCloseCircle
          size="1.8em"
          className="modal-close-btn"
          onClick={closeModal}
        />
      </div>

      {toCommentDelete && (
        <>
          <h1 className="delete-prompt">
            Are you sure you want to delete this comment?
          </h1>
          {commentLoading ? (
            <div className="isloadingIcon postloading"></div>
          ) : (
            <div className="modal-delete-options">
              <button className="post-delete" onClick={deleteComment}>
                YES
              </button>
              <button className="post-edit" onClick={closeModal}>
                NO
              </button>
            </div>
          )}
        </>
      )}

      {toCommentEdit && (
        <div className="create-comment-container">
          <h2>Update Comment</h2>
          <Formik
            initialValues={initialvalues}
            validationSchema={validationSchema}
            onSubmit={updateComment}
          >
            {(formProps) => (
              <Form className="createCommentform">
                <ErrorMessage name="commentText" component="span" />
                <Field
                  id="createpost"
                  as="textarea"
                  name="commentText"
                  placeholder="post your ideas or images here"
                />
                <input
                  id="createpostimg"
                  type="file"
                  name="commentImg"
                  //   had to use a different function prop to get the image cuz formik doesn't use
                  //   the default file selector
                  onChange={(event) => {
                    formProps.setFieldValue(
                      "commentImg",
                      event.target.files[0]
                    );
                  }}
                />

                {commentLoading ? (
                  <div className="isloadingIcon postloading"></div>
                ) : (
                  <div className="commentBtn-container">
                    <button className="createCommentBtn" type="submit">
                      Update
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default CommentModal;
