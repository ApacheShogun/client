import Card from "../../components/Cards/Card";
import "./Home.css";
import { news } from "../../assets/apiNews";
import { useEffect, useState } from "react";
import { AiOutlineRocket } from "react-icons/ai";
import { BsNewspaper } from "react-icons/bs";
import { formatDistanceStrict } from "date-fns";
import CreatePostForm from "../../components/CreatePost/CreatePost";

const Home = ({
  allposts,
  setAllPosts,
  isLoading,
  setIsLoading,
  allLikes,
  setAllLikes,
}) => {
  // console.log(allposts);
  const [showTabs, setShowTabs] = useState(false);
  const [toggleTabs, setToggleTabs] = useState(1);

  useEffect(() => {
    window.addEventListener("scroll", showTheMobileTabs);

    return () => {
      window.removeEventListener("scroll", showTheMobileTabs);
    };
  }, []);

  const showTheMobileTabs = () => {
    window.scrollY >= 105 ? setShowTabs(true) : setShowTabs(false);
  };

  return (
    <div className="home-page">
      <div className="banner-container">
        <div className="banner-content">
          <h1 className="banner-text">
            Got ideas on your luner surface? Post them to the many astronauts to
            view!
          </h1>
        </div>
      </div>

      <div className="content-flex">
        <div className="content-container">
          {/* on small screens the content switches on the clicked tab */}
          <div
            className={
              toggleTabs === 1
                ? "post-container active-container"
                : "post-container"
            }
          >
            {/* create a post form component */}
            <CreatePostForm
              setAllPosts={setAllPosts}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            <div className="post-wrapper">
              {allposts.map((post) => {
                return (
                  <Card
                    key={post.id}
                    post={post}
                    allLikes={allLikes}
                    setAllLikes={setAllLikes}
                    setAllPosts={setAllPosts}
                  />
                );
              })}
            </div>
          </div>
          <div
            className={
              toggleTabs === 2
                ? "news-container active-container"
                : "news-container"
            }
          >
            <h1>News In Orbit</h1>
            <div className="news-wrapper">
              {news.map((article) => (
                <div className="news-article" key={article.id}>
                  <div className="news-content">
                    <span className="news-time">
                      {formatDistanceStrict(
                        new Date(article.publishedAt),
                        new Date(),
                        { addSuffix: true }
                      )}
                    </span>
                    <h3 className="news-title">{article.title}</h3>
                    <p className="news-summary">{article.summary}</p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-website"
                    >
                      visit artice website
                    </a>
                  </div>
                  <div className="news-img">
                    <img src={article.imageUrl} alt="article" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* show tabs on small screens */}
      <div
        className={showTabs ? "mobile-tabs mobile-tabs-active" : "mobile-tabs"}
      >
        {/* on moble screen show content by clicking on tabs */}
        <div
          className={toggleTabs === 1 ? "tab-icon active-tab" : "tab-icon"}
          onClick={() => setToggleTabs(1)}
        >
          <AiOutlineRocket
            color={toggleTabs === 1 ? "black" : "white"}
            size="2em"
          />
        </div>

        <div
          className={toggleTabs === 2 ? "tab-icon active-tab" : "tab-icon"}
          onClick={() => setToggleTabs(2)}
        >
          <BsNewspaper
            color={toggleTabs === 2 ? "black" : "white"}
            size="2.1em"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
