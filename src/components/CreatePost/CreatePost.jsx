import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./CreatePost.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

// using the formik library to make validating forms easier

// yup helps with the validation

const CreatePostForm = ({ setAllPosts, isLoading, setIsLoading }) => {
  const navigate = useNavigate();

  const { user } = useAuthContext();

  const initialvalues = {
    postText: "",
    postImg: "",
  };

  const validationSchema = Yup.object().shape({
    postText: Yup.string().max(140).required(),
    postImg: Yup.mixed(),
  });

  const handleSubmit = (data, onSubmitProps) => {
    
    setIsLoading(true);
    onSubmitProps.resetForm()
    // if user is not logged in
    if (!user) {
      console.log("log in");
      return navigate("/login");
    }

    // if user makes a post with just text and without a image
    if (!data.postImg) {
      axios
        .post("http://localhost:4000/api/post", data, {
          headers: { jwtToken: user.token },
        })
        .then((res) => {
          const newPost = res.data.post;
          newPost.Likes = [];
          newPost.Comments = [];
          console.log(newPost);
          setAllPosts((prev) => [...prev, newPost]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error.response.data.error);
        });
    } else {
      // if user includes a image with the post
      const formData = new FormData();
      formData.append("file", data.postImg);
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
              "http://localhost:4000/api/post",
              {
                postText: data.postText,
                postImg: fileName,
              },
              {
                headers: { jwtToken: user.token },
              }
            )
            .then((res) => {
              const newPost = res.data.post;
              newPost.Likes = [];
              newPost.Comments = [];
              setAllPosts((prev) => [...prev, newPost]);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="create-post-container">
      <h2>create a post</h2>
      <Formik
        initialValues={initialvalues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formProps) => (
          <Form className="createform">
            <Field
              id="createpost"
              as="textarea"
              name="postText"
              placeholder="post your ideas or images here"
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

            {isLoading ? (
              <div className="isloadingIcon postloading"></div>
            ) : (
              <button className="createformBtn" type="submit">
                post
              </button>
            )}

            <ErrorMessage name="postText" component="span" />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePostForm;
