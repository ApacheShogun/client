import Card from "../../components/Cards/Card";
import "./Home.css";
import { posts } from "../../assets/dummydata";
import { useEffect, useState } from "react";
import { AiOutlineRocket } from "react-icons/ai";
import { BsNewspaper } from "react-icons/bs";

const Home = () => {
  const [allposts, setAllPost] = useState([]);
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
        <h1 className="banner-text">
          Got ideas on your luner surface? Post them to the many astronauts to
          view!
        </h1>
      </div>
      <div className="content-container">
        {/* in mobile screens content popup on which tab is clicked */ }
        <div className={toggleTabs === 1 ? "post-container active-container" : 'post-container'}>
          {posts.map((post) => {
            return <Card key={post.id} post={post} />;
          })}
        </div>
        <div className={toggleTabs === 2 ? "news-container active-container" : 'news-container'}>
          <h1>news</h1>
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
