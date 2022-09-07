import { AiOutlineCloseCircle } from "react-icons/ai";
import axios from "axios";
import "./Modal.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const Modal = ({
  setToggleModal,
  setToDelete,
  setToEdit,
  toDelete,
  toEdit,
  postId,
  postText,
  setAllPosts,
  setSinglePost,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [modalLoading, setModalLoading] = useState(false);

  const initialvalues = {
    postText: postText,
    postImg: "",
  };

  const validationSchema = Yup.object().shape({
    postText: Yup.string().max(140).required("don't leave text input blank"),
    postImg: Yup.mixed(),
  });

  // close the modal
  const closeModal = () => {
    setToggleModal(false);
    setToDelete(false);
    setToEdit(false);
  };

  // update post
  const updatePost = (data) => {
    setModalLoading(true);

    if (!user) {
      console.log("log in");
      return navigate("/login");
    }

    // if user makes a post with just text and without a image
    if (!data.postImg) {
      axios
        .put(
          `${process.env.REACT_APP_API_DB}/api/post`,
          {
            id: postId,
            postText: data.postText,
            postImg: data.postImg,
          },
          {
            headers: { jwtToken: user.token },
          }
        )
        .then((res) => {
          console.log(res.data);
          setModalLoading(false);
          setSinglePost((prev) => ({ ...prev, postText: data.postText }));
          closeModal();
          // const newPost = res.data.post
          // setAllPosts(prev => [...prev, newPost])
        })
        .catch((error) => {
          console.log(error.response.data.error);
          alert(error.response.data.error);
        });
    } else {
      // if user includes a image with the post
      const formData = new FormData();
      formData.append("file", data.postImg);
      formData.append("upload_preset", "jhpnjpgh");

      // send the postImg data to cloudinary
      axios
        .post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`, formData)
        .then((res) => {
          // get back the image asset id from cloudary
          const fileName = res.data.public_id;

          // then send all the text and img asset id to the database
          axios
            .put(
              `${process.env.REACT_APP_API_DB}/api/post`,
              {
                id: postId,
                postText: data.postText,
                postImg: fileName,
              },
              {
                headers: { jwtToken: user.token },
              }
            )
            .then((res) => {
              console.log(res.data);
              setModalLoading(false);
              setSinglePost((prev) => ({
                ...prev,
                postText: data.postText,
                postImg: fileName,
              }));
              closeModal();
            });
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.error);
        });
    }
  };

  // delete post
  const deletePost = (id) => {
    setModalLoading(true);
    axios
      .delete(`${process.env.REACT_APP_API_DB}/api/post/${id}`, {
        headers: { jwtToken: user.token },
      })
      .then((res) => {
        setModalLoading(false);
        setAllPosts((prev) => prev.filter((post) => post.id !== id));
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.error);
      });
  };

  return (
    <div className="modal-container">
      <div className="modal-btn-container">
        <AiOutlineCloseCircle
          size="1.8em"
          onClick={closeModal}
          className="modal-close-btn"
        />
      </div>

      {toDelete && (
        <>
          <h1 className="delete-prompt">
            Are you sure you want to delete this post?
          </h1>
          <div className="modal-delete-options">
            <button className="post-delete" onClick={() => deletePost(postId)}>
              YES
            </button>
            <button className="post-edit" onClick={closeModal}>
              NO
            </button>
          </div>
        </>
      )}

      {toEdit && (
        <>
          <h2>Update your post</h2>
          <Formik
            initialValues={initialvalues}
            validationSchema={validationSchema}
            onSubmit={updatePost}
          >
            {(formProps) => (
              <Form className="createform">
                <ErrorMessage name="postText" component="span" />
                <Field
                  id="createpost"
                  as="textarea"
                  name="postText"
                  placeholder="update post"
                />
                <input
                  id="createpostimg"
                  type="file"
                  name="postImg"
                  //   had to use a different function prop to get the image cuz formik doesn't use
                  //   the default file selector
                  onChange={(event) => {
                    formProps.setFieldValue("postImg", event.target.files[0]);
                  }}
                />

                {modalLoading ? (
                  <div className="isloadingIcon postloading"></div>
                ) : (
                  <div className="edit-post-container">
                    <button className="post-edit" type="submit">
                      EDIT
                    </button>
                    <button className="post-delete" onClick={closeModal}>
                      CANCEL
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};

export default Modal;
