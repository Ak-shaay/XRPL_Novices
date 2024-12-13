import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Auth: false,
  name: "user",
  role: "",  // Add role to the state
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.Auth = true;
      state.name = action.payload.name;
      state.walletAddress = action.payload.walletAddress;
      state.role = action.payload.role; // Save the role from the backend
    },
    setLoggedOut: (state) => {
      state.Auth = false;
      state.name = "";
      state.walletAddress = "";
      state.role = ""; // Reset the role on logout
    },
  },
});

export const { setLoggedIn, setLoggedOut } = userSlice.actions;

export default userSlice.reducer;
