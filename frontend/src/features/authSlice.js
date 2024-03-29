import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  value: [],
  user: null
}

export const authSlice = createSlice({  

  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    dataUser: (state, action) => {
      state.value = action.payload
    },
    logout: (state) => {
      state.user = null
    },
  },

})

export const { login, logout, dataUser } = authSlice.actions

export default authSlice.reducer