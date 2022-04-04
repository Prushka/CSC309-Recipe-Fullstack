/*
 * Copyright 2022 Dan Lyu.
 */

import {configureStore, createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {UserAPI} from '../axios/Axios'

// this is just to keep a cache
// session is handled in backend

const initialState = {
    id: undefined,
    name: "",
    email: "",
    avatar: "",
    role: undefined,
    followers: [],
    following: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {...initialState},
    reducers: {
        setUser: (state, action) => {
            state = {...action.payload}
            state.id = action.payload._id
            return state
        },
        resetUser: (state) => {
            return {...initialState}
        }
    },
})

export const {setUser, resetUser} = userSlice.actions

export default userSlice.reducer

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
})