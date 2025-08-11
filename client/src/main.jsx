import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/login/Login.jsx";
import Profile from "./components/profile/profile.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

const router = createBrowserRouter([
  { path: "/*", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <Profile /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
