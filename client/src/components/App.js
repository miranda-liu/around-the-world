import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Profile from "./pages/Profile.js";
import Feed from "./pages/Feed.js";
import PlanTrip from "./pages/PlanTrip.js";
import Settings from "./pages/Settings.js";
import Page from "./modules/Page.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined); // can't use console.log to check this on render since it's async and delayed

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
    // Refreshes the page
    location.reload(); // TODO: Is there a better solution using hooks to refresh content on login and logout?
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
    location.reload();
  };

  return (
    <div>
      <Page userId={userId}>
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
          <Route
            path="/settings"
            element={
              <Settings handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
            }
          />
          <Route path="*" element={<NotFound userId={userId} />} />
        </Routes>
      </Page>
    </div>
  );
};

export default App;
