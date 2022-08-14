import "./Comments.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceStrict } from "date-fns";
import { AiFillLike } from "react-icons/ai";
import CommentModal from "./CommentModal";
import { Image } from "cloudinary-react";

const Comments = ({ isLoading, postId, setIsLoading }) => {
  const [allComments, setAllComments] = useState([]);
  const [toggleCommentModal, setToggleCommentModal] = useState(false)
  const [toCommentDelete, setToCommentDelete] = useState(false)
  const [toCommentEdit, setToCommentEdit] = useState(false)
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/comment/${postId}`)
      .then((res) => {
        console.log(res.data);
        setAllComments(res.data.comments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [postId]);

  const initialvalues = {
    commentText: "",
    commentImg: "",
  };

  const validationSchema = Yup.object().shape({
    commentText: Yup.string().max(140).required(),
    commentImg: Yup.mixed(),
  });

  // post a comment
  const handleSubmit = (data) => {
    setIsLoading(true);
    // if user is not logged in
    if (!user) {
      console.log("log in");
      return navigate("/login");
    }

    // if user makes a post with just text and without a image
    if (!data.commentImg) {
      axios
        .post(
          "http://localhost:4000/api/comment",
          {
            commentText: data.commentText,
            commentImg: "",
            PostId: postId
          },
          {
            headers: { jwtToken: user.token },
          }
        )
        .then((res) => {
          console.log(res.data);
          setIsLoading(false);
          setAllComments((prev) => [...prev, res.data.comment]);
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
            .post(
              "http://localhost:4000/api/comment",
              {
                commentText: data.commentText,
                commentImg: fileName,
                PostId: postId
              },
              {
                headers: { jwtToken: user.token },
              }
            )
            .then((res) => {
              const newComment = res.data.comment;
              // newComment.Likes = []
              setAllComments((prev) => [...prev, newComment]);
              setIsLoading(false)
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const showCommentDelete = () => {
    setToggleCommentModal(true)
    setToCommentDelete(true)
  }

  const showCommentEdit = () => {
    setToggleCommentModal(true)
    setToCommentEdit(true)
  }

  return (
    <div className="comment-container">
      <div className="create-comment-container">
        <h2>reply with a comment</h2>
        <Formik
          initialValues={initialvalues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                  formProps.setFieldValue("commentImg", event.target.files[0]);
                }}
              />

              {isLoading ? (
                <div className="isloadingIcon postloading"></div>
              ) : (
                <div className="commentBtn-container">
                  <button className="createCommentBtn" type="submit">
                    reply
                  </button>
                </div>
              )}

            </Form>
          )}
        </Formik>
      </div>
      <div className="comment-flex">
      {allComments.map((comment) => (
        <div className="single-comment" key={comment.id}>
          <div className="post-user-info">
            <p className="post-username">@{comment.username}</p>
            <p className="post-posted-date">
              replied{" "}
              {formatDistanceStrict(new Date(comment.updatedAt), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
          <p className="post-comment-text">{comment.commentText}</p>
          {comment.commentImg && (
            <div className="post-img-container">
              <Image cloudName="dwfb3adcj" publicId={comment.commentImg} />
            </div>
          )}
          <div className="post-interactions">
            <div className="post-likes">
              <AiFillLike color="#02b9f2" size="1.5em" className="like-icon" />
              {/* the button shows blue if user is logged in and liked the post */}
              {/* {user && allLikes.includes(comment.id) ? (
              <AiFillLike
                color="#02b9f2"
                size="1.5em"
                className="like-icon"
                onClick={() => handleLike(comment.id)}
              />
            ) : (
              <AiOutlineLike
                size="1.5em"
                className="like-icon"
                onClick={() => handleLike(comment.id)}
              />
            )} */}
              <p className="post-like-amount">likes</p>
            </div>

            {/* if user is loggin and if their username is the same as the post username */}
            {user && user.username === comment.username && (
              <div className="post-functions">
                <button className="post-edit" onClick={showCommentEdit}>EDIT</button>
                <button className="post-delete" onClick={showCommentDelete}>DELETE</button>
              </div>
            )}
          </div>

        {toggleCommentModal && (
          <div className="post-backdrop">
            <CommentModal 
            setToggleCommentModal={setToggleCommentModal}
            setToCommentDelete={setToCommentDelete}
            setToCommentEdit={setToCommentEdit}
            toCommentDelete={toCommentDelete}
            toCommentEdit={toCommentEdit}
            commentId={comment.id}
            commentText={comment.commentText}
            setAllComments={setAllComments}
            />
          </div>
        )}
        </div>
      ))}

      </div>
    </div>
  );
};

export default Comments;
