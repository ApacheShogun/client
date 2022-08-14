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

function App() {
  const [allposts, setAllPosts] = useState([]);
  const [allLikes, setAllLikes] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  console.log(allposts);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/post")
      .then((res) => {
        setAllPosts(res.data.listofposts);
        
      })
      .catch((error) => {
        console.log(error);
      });

      // puts all the liked post in state if the user is logged in
      if(user){
        axios.get("http://localhost:4000/api/like", {
          headers: { jwtToken: user.token }
        }).then(res => {
          setAllLikes(res.data.likedPosts.map(like => like.PostId))
        }).catch(error => {
          console.log(error);
        })
      }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
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
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
