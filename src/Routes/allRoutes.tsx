import React from "react";
import { Navigate } from "react-router-dom";

//AuthenticationInner pages
import BasicSignIn from '../pages/AuthenticationInner/Login/BasicSignIn';
import CoverSignIn from '../pages/AuthenticationInner/Login/CoverSignIn';
import BasicSignUp from '../pages/AuthenticationInner/Register/BasicSignUp';
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from '../pages/AuthenticationInner/PasswordReset/BasicPasswReset';

//login
import Login from "../pages/Authentication/Login";
//import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
// User Profile
//import UserProfile from "../pages/Authentication/user-profile";

// Create a simple Dashboard component if it doesn't exist
const Dashboard = () => <div>Dashboard Page</div>;

const authProtectedRoutes = [
  // Add dashboard route
  { path: "/dashboard", component: <Dashboard /> },
  
  //User Profile
  //{ path: "/profile", component: <UserProfile /> },
  
  // Root redirect
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  
  // Catch all redirect
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  //{ path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-signup-cover", component: <CoverSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
];

export { authProtectedRoutes, publicRoutes };