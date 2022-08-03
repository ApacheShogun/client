import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import Home from "./pages/Home/Home";
import Post from "./pages/Post/Post";
import { posts } from "./assets/dummydata";
import { useEffect, useState} from "react";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";

function App() {
  const [allposts, setAllPost] = useState([]);

  useEffect(() => {
    setAllPost(posts)
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home allposts={allposts}/>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/post/:id" element={<Post allposts={allposts}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
