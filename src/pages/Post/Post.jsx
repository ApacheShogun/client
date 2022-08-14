import { useNavigate, useParams } from "react-router-dom";
import "./Post.css";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useEffect, useState } from "react";
import { formatDistanceStrict } from "date-fns";
import { Image } from "cloudinary-react";
import Modal from "../../components/Modal/Modal";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import Comments from "./CommentSection./Comments";

const Post = ({
  setAllPosts,
  isLoading,
  setIsLoading,
  allLikes,
  setAllLikes,
}) => {
  const { id } = useParams();
  const [toggleModal, setToggleModal] = useState(false);
  const [toDelete, setToDelete] = useState(false);
  const [toEdit, setToEdit] = useState(false);
  const [singlePost, setSinglePost] = useState({});
  const navigate = useNavigate();

  const { user } = useAuthContext();

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

  // like a post
  const handleLike = (id) => {
    if (!user) {
      console.log("log in");
      return navigate("/login");
    }

    axios
      .post(
        "http://localhost:4000/api/like",
        {
          PostId: id,
        },
        {
          headers: { jwtToken: user.token },
        }
      )
      .then((res) => {
        console.log(res.data);
        setSinglePost((prev) => {
          if (prev.id === id) {
            if (res.data.liked) {
              return { ...prev, Likes: [...prev.Likes, 0] };
            } else {
              const likesArray = prev.Likes;
              likesArray.pop();
              return { ...prev, Likes: likesArray };
            }
          } else {
            return prev;
          }
        });

        setAllPosts((prev) => {
          return prev.map((p) => {
            if (p.id === id) {
              if (res.data.liked) {
                return { ...p, Likes: [...p.Likes, 0] };
              } else {
                const likesArray = p.Likes;
                likesArray.pop();
                return { ...p, Likes: likesArray };
              }
            } else {
              return p;
            }
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });

    // some jank way of toggling the liked icons based on the current login user
    if (allLikes.includes(id)) {
      setAllLikes((prev) => prev.filter((i) => i !== id));
    } else {
      setAllLikes((prev) => [...prev, id]);
    }
  };

  // this function returns the date from the post after it the post data has been fetched.
  function date() {
    if (singlePost.updatedAt) {
      return formatDistanceStrict(new Date(singlePost.updatedAt), new Date(), {
        addSuffix: true,
      });
    }
  }

  // this function returns the like count from the post after it the post data has been fetched.
  function likeCount() {
    if (singlePost.Likes) {
      return singlePost.Likes.length;
    }
  }

  return (
    <div className="single-post-container">
      <div className="single-post" key={singlePost.id}>
        <div className="post-user-info">
          <p className="post-username">@{singlePost.username}</p>
          <p className="post-posted-date">posted {date()}</p>
        </div>
        <p className="post-comment-text">{singlePost.postText}</p>
        {singlePost.postImg && (
          <div className="post-img-container">
            <Image cloudName="dwfb3adcj" publicId={singlePost.postImg} />
          </div>
        )}
        <div className="post-interactions">
          <div className="post-likes">
            {/* the button shows blue if user is logged in and liked the post */}
            {user && allLikes.includes(singlePost.id) ? (
              <AiFillLike
                color="#02b9f2"
                size="1.5em"
                className="like-icon"
                onClick={() => handleLike(singlePost.id)}
              />
            ) : (
              <AiOutlineLike
                size="1.5em"
                className="like-icon"
                onClick={() => handleLike(singlePost.id)}
              />
            )}
            <p className="post-like-amount">{likeCount()} likes</p>
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
              setAllPosts={setAllPosts}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setSinglePost={setSinglePost}
            />
          </div>
        )}
      </div>
      <Comments isLoading={isLoading} postId={id} setIsLoading={setIsLoading}/>
    </div>
  );
};

export default Post;
