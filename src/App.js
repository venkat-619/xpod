import React, { useEffect, useReducer, useState} from "react";

// reactstrap
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

// react-router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

// layout
import Header from "./layout/Header";

// pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PageNotFound from "./pages/PageNotFound";

// context api stuffs
import reducer from "./context/reducer";
import { UserContext } from "./context/UserContext";
import ProfilePage from "./pages/ProfilePage";
import { SET_THEME_MODE } from "./context/action.types";

// import Axios from "axios";
// import API_BASE from "./helper/apiUrl";
// import { SET_LOADING } from "./context/action.types";

// first state to provide in react reducer
const initialState = {
  posts:[],
  userPosts: [],
  post:{},
  updatedPost: {},
  friends:[],
  profileFriends:[],
  isLoading: false,
  theme: "light"
};

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState(null);
  // const {theme} = state;

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if(jwt){
      setUser(JSON.parse(localStorage.getItem("user")));
    }

    const theme = localStorage.getItem("theme");
    dispatch({type: SET_THEME_MODE, 
      payload: theme ==="light" ? "dark" : "light"
    });

  }, []);

  useEffect(() => {
    if(state.theme === "light"){
      document.body.style.backgroundColor = "#fff";
    } else {
      document.body.style.backgroundColor = "#000";
    }
  }, [state.theme]);

  return (
    <div className="app">
      <Router>
        <UserContext.Provider value={{state, dispatch, user, setUser}}>
          <ToastContainer />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={< Signup/>} />
            <Route path="/signin" element={< Signin/>} />
            <Route path="/profile/:userprofileId" element={< ProfilePage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
