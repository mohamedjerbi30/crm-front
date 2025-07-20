// src/slices/auth/profile/thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

//Include Both Helper File with needed methods
import { postJwtProfile, postFakeProfile } from "../../../helpers/fakebackend_helper";

import {
  profileSuccess,
  profileError,
  resetProfileFlagChange,
} from "./reducer";

// Edit user profile
export const editProfile = createAsyncThunk(
  "profile/editProfile",
  async (user: any, { dispatch, rejectWithValue }) => {
    try {
      let response;
      
      if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
        response = await postJwtProfile(user);
      } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        response = await postFakeProfile(user);
      }

      if (response) {
        const data = response.data;
        dispatch(profileSuccess({
          status: "Profile updated successfully!",
          data: data
        }));
        
        toast.success("Profile updated successfully!");
        return data;
      }
    } catch (error: any) {
      let message = "Profile update failed";
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      dispatch(profileError(message));
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Reset profile flags
export const resetProfileFlag = createAsyncThunk(
  "profile/resetProfileFlag",
  async (_, { dispatch }) => {
    dispatch(resetProfileFlagChange());
  }
);

// Get user profile
export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Get user from session storage
      const authUser = sessionStorage.getItem("authUser");
      if (authUser) {
        const user = JSON.parse(authUser);
        dispatch(profileSuccess({
          status: "Profile loaded successfully!",
          data: user.data || user
        }));
        return user.data || user;
      } else {
        throw new Error("No authenticated user found");
      }
    } catch (error: any) {
      const message = error.message || "Failed to load profile";
      dispatch(profileError(message));
      return rejectWithValue(message);
    }
  }
);
