import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import { formatDistanceStrict } from "date-fns";
import "./Card.css";

const Card = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="card-post" onClick={() => navigate(`/post/${post.id}`)}>
      <div className="card-user-info">
        <p className="card-username">@{post.username}</p>
        <p className="card-posted-date">
          posted {formatDistanceStrict(new Date(post.updatedAt), new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>
      <p className="card-comment-text">{post.postText}</p>

      {post.postImg && (
        <div className="card-img-container">
          <Image cloudName="dwfb3adcj" publicId={post.postImg} loading="lazy" />
        </div>
      )}

      <div className="card-interactions">
        <div className="card-likes">
          <AiOutlineLike size="1.5em" />
          <p className="card-like-amount">4 likes</p>
        </div>
        <div className="card-comments">
          <BiComment size="1.5em" />
          <p className="card-comment-amount">3 comments</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
