import { AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import "./Card.css";

const Card = ({ post }) => {
  return (
    <div className="card-post">
      <div className="card-user-info">
        <p className="card-username">@{post.username}</p>
        <p className="card-posted-date">posted 1d ago</p>
      </div>
      <p className="card-comment-text">{post.text}</p>

      {post.img && (
        <div className="card-img-container">
          <img src={require(`../../assets/${post.img}`)} alt="picure" />
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
