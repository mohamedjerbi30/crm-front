import { registerUserSuccessful, registerUserFailed } from './reducer';
import { postFakeRegister } from "../../../helpers/fakebackend_helper";

export const registerUser = (user: any) => async (dispatch: any) => {
  try {
    const response = await postFakeRegister(user);
    
    // Axios response structure: response.data contains the actual API response
    const responseData = response.data;
    
    // Check success in the data payload, not the HTTP status
    if (responseData.success || responseData.status === "success" || response.status === 200) {
      dispatch(registerUserSuccessful(responseData));
    } else {
      dispatch(registerUserFailed(responseData.message || "Registration failed"));
    }
  } catch (error: any) {
    // Handle error response properly
    const errorMessage = error.response?.data?.message || error.message || "Registration failed";
    dispatch(registerUserFailed(errorMessage));
  }
};

// Export the missing function that is imported in components
export const resetRegisterFlag = () => (dispatch: any) => {
  // You need to import the correct action from your register reducer
  // Replace 'reset_register_flag' with the actual action name from your register reducer
  // dispatch(reset_register_flag());
  
  // This is a placeholder - implement the actual reset action
  console.log('Reset register flag - implement this action');
};