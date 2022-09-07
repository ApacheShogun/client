import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import { formatDistanceStrict } from "date-fns";
import "./Card.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

const Card = ({ post, allLikes, setAllLikes, setAllPosts }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleLike = (id) => {
    if (!user) {
      console.log("log in");
      return navigate("/login");
    }

    axios
      .post(
        "https://nebula-poster-backend.herokuapp.com/api/like",
        {
          PostId: id,
        },
        {
          headers: { jwtToken: user.token },
        }
      )
      .then((res) => {
        console.log(res.data);
        // some old jank way of updating the like count in state when you click like
        setAllPosts((prev) => {
          return prev.map((p) => {
            if (p.id === id) {
              if (res.data.liked) {
                return { ...p, Likes: [...p.Likes, res.data] };
              } else {
                const likesArray = p.Likes;
                likesArray.pop()
                return { ...p, Likes: [likesArray] };
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

  return (
    <div className="card-post">
      <div className="card-user-info">
        <p className="card-username" onClick={() => navigate(`/profile/${post.UserId}`)}>@{post.username}</p>
        <p className="card-posted-date">
          posted{" "}
          {formatDistanceStrict(new Date(post.updatedAt), new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div
        className="card-content"
        onClick={() => navigate(`/post/${post.id}`)}
      >
        <p className="card-comment-text">{post.postText}</p>

        {post.postImg && (
          <div className="card-img-container">
            <Image
              cloudName={process.env.REACT_APP_CLOUD_NAME}
              publicId={post.postImg}
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div className="card-interactions">
        <div className="card-likes">
          {/* the button shows blue if user is logged in and liked the post */}
          {user && allLikes.includes(post.id) ? (
            <AiFillLike
              color="#02b9f2"
              size="1.5em"
              className="like-icon"
              onClick={() => handleLike(post.id)}
            />
          ) : (
            <AiOutlineLike
              size="1.5em"
              className="like-icon"
              onClick={() => handleLike(post.id)}
            />
          )}
          <p className="card-like-amount">
            { post.Likes.length} {post.Likes.length === 1 ? "like" : "likes"}
          </p>
        </div>
        <div className="card-comments" onClick={() => navigate(`/post/${post.id}`)}>
          <BiComment size="1.5em" />
          <p className="card-comment-amount">{post.Comments.length} comments</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
