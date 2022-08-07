import { useParams } from "react-router-dom";
import "./Post.css";
import { AiOutlineLike } from "react-icons/ai";
import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { Image } from "cloudinary-react";
import Modal from "../../components/Modal/Modal";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

const Post = ({ setAllPost, isLoading, setIsLoading }) => {
  const { id } = useParams();
  const [toggleModal, setToggleModal] = useState(false);
  const [toDelete, setToDelete] = useState(false);
  const [toEdit, setToEdit] = useState(false);
  const [singlePost, setSinglePost] = useState({});

  const { user } = useAuthContext();

  console.log(singlePost);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/post/${id}`)
      .then((res) => {
        setSinglePost(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const showDelete = () => {
    setToggleModal(true);
    setToDelete(true);
  };

  const showEdit = () => {
    setToggleModal(true);
    setToEdit(true);
  };

  // this function returns the date from the post after it the post data has been fetched.
 function date(){
   if(singlePost.updatedAt){
    return formatDistance(new Date(singlePost.updatedAt), new Date(), {
      addSuffix: true,
    })
   }
 }

  return (
    <div className="single-post-container">
      <div className="single-post" key={singlePost.id}>
        <div className="post-user-info">
          <p className="post-username">@{singlePost.username}</p>
          <p className="post-posted-date">
            posted at {date()}
          </p>
        </div>
        <p className="post-comment-text">{singlePost.postText}</p>
        {singlePost.postImg && (
          <div className="post-img-container">
            <Image cloudName="dwfb3adcj" publicId={singlePost.postImg} />
          </div>
        )}
        <div className="post-interactions">
          <div className="post-likes">
            <AiOutlineLike size="1.5em" />
            <p className="post-like-amount">4 likes</p>
          </div>

          {/* if user is loggin and if their username is the same as the post username */}
          {user && user.username === singlePost.username && (
            <div className="post-functions">
              <button className="post-edit" onClick={showEdit}>
                EDIT
              </button>
              <button className="post-delete" onClick={showDelete}>
                DELETE
              </button>
            </div>
          )}
        </div>

        {/* pop up modal */}
        {toggleModal && (
          <div className="post-backdrop">
            <Modal
              setToggleModal={setToggleModal}
              toDelete={toDelete}
              setToDelete={setToDelete}
              toEdit={toEdit}
              setToEdit={setToEdit}
              postId={singlePost.id}
              postText={singlePost.postText}
              setAllPost={setAllPost}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSinglePost={setSinglePost}
            />
          </div>
        )}
      </div>

      <div className="comment-container">
        <div className="comment">
          <h3 className="comment-username">@comment person</h3>
          <p className="comment-body">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Repellendus ducimus doloribus possimus similique tempora ex quas,
            commodi sequi, dicta tenetur magni nisi porro tempore vero aliquid
            in eligendi explicabo! Minima?
          </p>
          <span className="comment-date">replied 1d ago</span>
        </div>
        <div className="comment">
          <h3 className="comment-username">@comment person</h3>
          <p className="comment-body">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Repellendus ducimus doloribus .
          </p>
          <span className="comment-date">replied 1d ago</span>
        </div>
        <div className="comment">
          <h3 className="comment-username">@comment person</h3>
          <p className="comment-body">
            {" "}
            dicta tenetur magni nisi porro tempore vero aliquid in eligendi
            explicabo! Minima?
          </p>
          <span className="comment-date">replied 1d ago</span>
        </div>
        <div className="comment">
          <h3 className="comment-username">@comment person</h3>
          <p className="comment-body">
            {" "}
            aliquid in eligendi explicabo! Minima?
          </p>
          <span className="comment-date">replied 1d ago</span>
        </div>
        <div className="comment">
          <h3 className="comment-username">@comment person</h3>
          <p className="comment-body">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Repellendus ducimus doloribus possimus similique tempora ex quas,
            commodi sequi, dicta tenetur magni nisi porro tempore vero aliquid
            in eligendi explicabo! Minima?
          </p>
          <span className="comment-date">replied 1d ago</span>
        </div>
        <div className="comment">
          <h3 className="comment-username">@comment person</h3>
          <p className="comment-body"> Minima?</p>
          <span className="comment-date">replied 1d ago</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
