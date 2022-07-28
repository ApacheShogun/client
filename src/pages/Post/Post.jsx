import { useParams } from "react-router-dom";
import "./Post.css";
import { AiOutlineLike } from "react-icons/ai";
import { useEffect, useState } from "react";

const Post = ({ allposts }) => {
  const { id } = useParams();

  const [singlePost, setSinglePost] = useState([]);

  useEffect(() => {
    const onlyPost = allposts.filter((post) => post.id === Number(id));
    setSinglePost(onlyPost);
  }, [allposts, id]);

  return (
    <div className="single-post-container">
      {singlePost.map((post) => (
        <div className="single-post" key={post.id}>
          <div className="post-user-info">
            <p className="post-username">@{post.username}</p>
            <p className="post-posted-date">posted 1d ago</p>
          </div>
          <p className="post-comment-text">{post.text}</p>

          <div className="post-interactions">
            <div className="post-likes">
              <AiOutlineLike size="1.5em" />
              <p className="post-like-amount">4 likes</p>
            </div>
          </div>
        </div>
      ))}

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
