import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';
import { postFakeLogin } from "../../../helpers/fakebackend_helper";
import { removeAuthorization } from "../../../helpers/api_helper";

export const loginUser = (user: any, history: any) => async (dispatch: any) => {
  try {
    // Always use your backend API
    const response = await postFakeLogin({
      email: user.email,
      password: user.password,
    });

    if (response) {
      // Axios response structure: response.data contains the actual API response
      const responseData = response.data;
      
      // Store the entire response or just the needed parts
      const authData = {
        user: responseData.user || responseData.data || responseData,
        token: responseData.token || responseData.accessToken,
        ...responseData
      };
      
      sessionStorage.setItem("authUser", JSON.stringify(authData));
      
      // Check success in the data payload, not the HTTP status
      if (responseData.success || responseData.status === "success" || response.status === 200) {
        dispatch(loginSuccess(authData));
        history('/dashboard');
      } else {
        dispatch(apiError(responseData));
      }
    }
  } catch (error: any) {
    // Handle error response properly
    const errorData = error.response?.data || { message: error.message };
    dispatch(apiError(errorData));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    sessionStorage.removeItem("authUser");
    removeAuthorization();
    dispatch(logoutUserSuccess(true));
  } catch (error: any) {
    dispatch(apiError(error as any));
  }
};

// Export the missing functions that are imported in components
export const socialLogin = (provider: string, data: any, history: any) => async (dispatch: any) => {
  try {
    // Implement your social login logic here
    // This is a placeholder - replace with your actual social login API call
    console.log('Social login not implemented yet');
  } catch (error: any) {
    dispatch(apiError(error as any));
  }
};

export const resetLoginFlag = () => (dispatch: any) => {
  dispatch(reset_login_flag());
};