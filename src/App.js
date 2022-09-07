import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import Home from "./pages/Home/Home";
import Post from "./pages/Post/Post";
// import { posts } from "./assets/dummydata";
import { useEffect, useState } from "react";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import axios from "axios";
import { useAuthContext } from "./hooks/useAuthContext";
import Error404 from "./pages/Error404/Error404";
import Profile from "./pages/Profile/Profile";

function App() {
  const [allposts, setAllPosts] = useState([]);
  const [allLikes, setAllLikes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_DB}/api/post`)
      .then((res) => {
        setAllPosts(res.data.listofposts);
      })
      .catch((error) => {
        console.log(error);
      });

    // puts all the liked post in state if the user is logged in
    if (user) {
      axios
        .get(`${process.env.REACT_APP_API_DB}/api/like`, {
          headers: { jwtToken: user.token },
        })
        .then((res) => {
          setAllLikes(res.data.likedPosts.map((like) => like.PostId));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          {/* the home page */}
          <Route
            path="/"
            element={
              <Home
                allposts={allposts}
                setAllPosts={setAllPosts}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                allLikes={allLikes}
                setAllLikes={setAllLikes}
              />
            }
          />

          {/* sign up page */}
          <Route path="/signup" element={<SignUp />} />

          {/* login page */}
          <Route path="/login" element={<Login />} />

          {/* single post page */}
          <Route
            path="/post/:id"
            element={
              <Post
                setAllPosts={setAllPosts}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                allLikes={allLikes}
                setAllLikes={setAllLikes}
              />
            }
          />

          <Route
            path="/profile/:id"
            element={
              <Profile
                allLikes={allLikes}
                setAllLikes={setAllLikes}
                setAllPosts={setAllPosts}
              />
            }
          />

          {/* 404 page */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
