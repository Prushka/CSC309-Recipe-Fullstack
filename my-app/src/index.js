import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from "./components/Profile";
import BrowseRecipe from "./components/BrowseRecipe";
import SavedRecipe from "./components/SavedRecipe";
import UploadRecipe from "./components/UploadRecipe";
import Login from "./components/LogIn_SignUp/Login";
import SignUp from "./components/LogIn_SignUp/SignUp";

ReactDOM.render(
  <>
    <BrowserRouter>
            <Routes>
                <Route path="profile" element={<Profile/>}/>
                <Route path="browse" element={<BrowseRecipe/>}/>
                <Route path="saved" element={<SavedRecipe/>}/>
                <Route path="upload" element={<UploadRecipe/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="signup" element={<SignUp/>}/>
                
            </Routes>
        </BrowserRouter>
    </>,
  document.getElementById('root')
);
