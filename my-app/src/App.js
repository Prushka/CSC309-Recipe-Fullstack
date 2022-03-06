import React, {useState} from 'react';
import './index.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Profile from "./components/Profile";
import BrowseRecipe from "./components/BrowseRecipe";
import SavedRecipe from "./components/SavedRecipe";
import PersonalRecipes from "./components/PersonalRecipes";
import SideBar from "./pages/SideBar";
import {AdminManageRecipes, AdminManageUsers, AdminManageReviews} from "./pages/Admin";
import TopBar from "./pages/TopBar";
import RecipePage2 from './components/RecipePage/RecipePage2';
import RecipePage1 from './components/RecipePage/RecipePage1';
import RecipePage3 from './components/RecipePage/RecipePage3';
import RecipePage4 from './components/RecipePage/RecipePage4';

export default function App() {
    const [sideBarOpen, setSideBarOpen] = useState(false);

    const PageComponent = ({path, children}) => {
        return (<>
            <div className={`${sideBarOpen ? 'side-bar-overlay' : ''}`} onClick={() => setSideBarOpen(false)}/>
            <TopBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen}/>
            <div className={'page-body'}>
                <SideBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} currentSelected={path}
                         userIsAdmin={true}/>
                <right-pane>{children}</right-pane>
            </div>
        </>)
    }
    return (<>
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Home/>}></Route>
                    <Route path={"dashboard"}
                           element={<PageComponent path={"/dashboard"}><Dashboard/></PageComponent>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="browse" element={<BrowseRecipe/>}/>
                    <Route path="saved" element={<SavedRecipe/>}/>
                    <Route path="personal-recipes" 
                           element={<PageComponent path={"/personal-recipes"}><PersonalRecipes/></PageComponent>}/>
                    <Route path={"/manage/users"}
                           element={<PageComponent path={"/manage/users"}><AdminManageUsers/></PageComponent>}/>
                    <Route path={"/manage/recipes"}
                           element={<PageComponent path={"/manage/recipes"}><AdminManageRecipes/></PageComponent>}/>
                    <Route path={"/manage/reviews"}
                           element={<PageComponent path={"/manage/reviews"}><AdminManageReviews/></PageComponent>}/>
                    <Route path="recipe/1" element={<RecipePage1 />} />
                    <Route path="recipe/2" element={<RecipePage2 />} />
                    <Route path="recipe/3" element={<RecipePage3 />} />
                    <Route path="recipe/4" element={<RecipePage4 />} />       
                </Routes>
            </BrowserRouter>
        </>
    )
}
