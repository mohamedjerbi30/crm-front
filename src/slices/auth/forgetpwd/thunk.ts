// src/slices/auth/forgetpwd/thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';

//Include Both Helper File with needed methods
import { postFakeForgetPwd, postJwtForgetPwd } from "../../../helpers/fakebackend_helper";

import {
  userForgetPasswordSuccess,
  userForgetPasswordError,
} from "./reducer";

// Thunk for handling forgot password
export const userForgetPassword = createAsyncThunk(
  "forgotPassword/userForgetPassword",
  async (user: any, { dispatch, rejectWithValue }) => {
    try {
      let response;
      
      if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
        response = await postJwtForgetPwd(user);
      } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        response = await postFakeForgetPwd(user);
      }

      if (response) {
        const message = response.data?.message || "Password reset instructions sent to your email!";
        dispatch(userForgetPasswordSuccess(message));
        toast.success(message);
        return response.data;
      }
    } catch (error: any) {
      let message = "Password reset failed";
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      dispatch(userForgetPasswordError(message));
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Reset forgot password flags
export const resetForgetPasswordFlag = createAsyncThunk(
  "forgotPassword/resetForgetPasswordFlag",
  async (_, { dispatch }) => {
    dispatch(userForgetPasswordSuccess(null));
    dispatch(userForgetPasswordError(null));
  }
);
