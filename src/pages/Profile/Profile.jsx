import "./Profile.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { formatDistanceStrict } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Profile = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [toggleProfileTabs, setToggleProfileTabs] = useState(1);
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userFollowers, SetUserFollowers] = useState([]);
  const [followerList, setFollowerList] = useState([]);

  useEffect(() => {
    setToggleProfileTabs(1);

    axios
      .get(`https://nebula-poster-backend.herokuapp.com/api/user/profile/${id}`)
      .then((res) => {
        setUserProfile(res.data.userInfo);
        setFollowerList(res.data.userInfo.Followers);

        if (user) {
          SetUserFollowers(
            res.data.userInfo.Followers.map((follower) => follower.FollowerId)
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(
        `https://nebula-poster-backend.herokuapp.com/api/post/profile/user/${id}`
      )
      .then((res) => {
        setUserPosts(res.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, user]);

  // like the post
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
        props.setAllPosts((prev) => {
          return prev.map((p) => {
            if (p.id === id) {
              if (res.data.liked) {
                return { ...p, Likes: [...p.Likes, res.data] };
              } else {
                const likesArray = p.Likes;
                likesArray.pop();
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
    if (props.allLikes.includes(id)) {
      props.setAllLikes((prev) => prev.filter((i) => i !== id));
    } else {
      props.setAllLikes((prev) => [...prev, id]);
    }
  };

  // follow the user
  const followUser = (FollowerId) => {
    if (!user) {
      console.log("log in");
      return navigate("/login");
    }

    axios
      .post(
        "https://nebula-poster-backend.herokuapp.com/api/user/follow",
        {
          FollowerId,
          UserId: userProfile.id,
        },
        {
          headers: { jwtToken: user.token },
        }
      )
      .then((res) => {
        console.log(res.data);
        setUserProfile((prev) => {
          if (prev.id === FollowerId) {
            if (res.data.followed) {
              return { ...prev, Followers: [...prev.Followers, 0] };
            } else {
              const FollowArr = prev.Followers;
              FollowArr.pop();
              return { ...prev, Followers: [FollowArr] };
            }
          } else {
            return prev;
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });

    if (userFollowers.includes(FollowerId)) {
      SetUserFollowers((prev) => prev.filter((i) => i !== FollowerId));
    } else {
      SetUserFollowers((prev) => [...prev, FollowerId]);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-bg"></div>

      <div className="profile-container">
        <div className="profile-avatar">
          <h1>{userProfile?.username?.charAt(0)}</h1>
        </div>
        <h1 className="profile-username">{userProfile?.username}</h1>
        {user && userFollowers.includes(user.id) ? (
          <span
            className="unfollow-btn"
            onClick={() => followUser(user.id)}
            style={{
              display:
                user?.username === userProfile?.username
                  ? "none"
                  : "inline-block",
            }}
          >
            Unfollow -
          </span>
        ) : (
          <span
            className="follow-btn"
            onClick={() => followUser(user?.id)}
            style={{
              display:
                user?.username === userProfile?.username
                  ? "none"
                  : "inline-block",
            }}
          >
            follow +
          </span>
        )}

        <p className="follower-count">
          {userProfile?.Followers?.length} followers
        </p>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <p
            className={
              toggleProfileTabs === 1
                ? "profile-posts-tab show-tab"
                : "profile-posts-tab"
            }
            onClick={() => setToggleProfileTabs(1)}
          >
            Posts
          </p>
          <p
            className={
              toggleProfileTabs === 2
                ? "profile-follower-tab show-tab"
                : "profile-follower-tab"
            }
            onClick={() => setToggleProfileTabs(2)}
          >
            Followers
          </p>
        </div>

        <div
          className="profile-posts"
          style={{ display: toggleProfileTabs === 1 ? "flex" : "none" }}
        >
          {userPosts.map((post) => (
            <div className="card-post" key={post.id}>
              <div className="card-user-info">
                <p
                  className="card-username"
                  onClick={() => navigate(`/profile/${post.UserId}`)}
                >
                  @{post.username}
                </p>
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
                  {user && props.allLikes.includes(post.id) ? (
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
                    {post.Likes.length}{" "}
                    {post.Likes.length === 1 ? "like" : "likes"}
                  </p>
                </div>
                <div
                  className="card-comments"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <BiComment size="1.5em" />
                  <p className="card-comment-amount">
                    {post.Comments.length} comments
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="profile-follower-list"
          style={{ display: toggleProfileTabs === 2 ? "flex" : "none" }}
        >
          {
           followerList.length === 0 && <h3 className="no-followers">This user have no followers yet</h3>
          }

          {followerList.map((follower) => (
            <div className="follower-list" key={follower.id}>
              <h1 onClick={() => navigate(`/profile/${follower.FollowerId}`)}>
                {follower.username}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
