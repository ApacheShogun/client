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

function App() {
  const [allposts, setAllPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/post")
      .then((res) => {
        setAllPost(res.data.listofposts);
      })
      .catch((error) => {
        console.log(error);
      });
    // setAllPost(posts)
  }, []);

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
                setAllPost={setAllPost}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/post/:id"
            element={
              <Post
                setAllPost={setAllPost}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
