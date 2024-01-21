import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Profile from "./pages/Profile.js";
import Feed from "./pages/Feed.js";
import PlanTrip from "./pages/PlanTrip.js";
import Settings from "./pages/Settings.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <div>
      <Routes>
        <Route
          path="/skeleton"
          element={
            <Skeleton handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
          }
        />
        <Route path="/" element={<Feed userId={userId} />} />
        <Route path="/profile" element={<Profile userId={userId} />} />
        <Route path="/plantrip" element={<PlanTrip userId={userId} />} />
        <Route path="/settings" element={<Settings userId={userId} />} />
        <Route path="*" element={<NotFound userId={userId} />} />
      </Routes>
    </div>
  );
};

export default App;