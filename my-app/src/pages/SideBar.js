import food from '../resources/food.jpg';
import {CgProfile, CgSearch, CgHomeAlt, CgHeart, CgPen, CgLogOut} from 'react-icons/cg'
import React from 'react';
import '../styles/Sidebar.css';
import SideBarButton from "../components/input/SideBarButton";
import {MdManageAccounts, MdOutlinePreview} from "react-icons/md";
import {IoFastFood} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";

function SideBar(props) {
    const user = useSelector((state) => state.user)
    const isSelected = (path) => {
        return props.currentSelected === path ? 'selected' : ''
    }
    const WrappedSideBarButton = ({title, path, icon}) => {
        return (<SideBarButton setSideBarOpen={props.setSideBarOpen} title={title} path={path} isSelected={isSelected} icon={icon}/>)
    }
    return (
        <div className={`side-bar ${props.sideBarOpen ? null : 'closed'}`} onClick={(e) => {
            e.stopPropagation();
        }}>
            <div className={'side-bar__img-group'}>
                <img src={food} alt='Food'/>
            </div>
            <div className={'side-bar-top-group'}>
                <WrappedSideBarButton title='Dashboard' path='/dashboard' icon={<CgHomeAlt/>}/>
                <WrappedSideBarButton title='My Profile' path='/profile' icon={<CgProfile/>}/>
                <WrappedSideBarButton title='Browse Recipes' path='/browse' icon={<CgSearch/>}/>
                <WrappedSideBarButton title='Saved Recipes' path='/saved' icon={<CgHeart/>}/>
                <WrappedSideBarButton title='Personal Recipes' path='/personal-recipes' icon={<CgPen/>}/>
                {user.role > 0 && <>
                    <WrappedSideBarButton title='Manage Users' path='/manage/users' icon={<MdManageAccounts/>}/>
                    <WrappedSideBarButton title='Manage Recipes' path='/manage/recipes' icon={<IoFastFood/>}/>
                    <WrappedSideBarButton title='Manage Reviews' path='/manage/reviews' icon={<MdOutlinePreview/>}/>
                </>
                }
            </div>
            <div className={'side-bar__bottom-group'}>
                <WrappedSideBarButton title='Log-out' path='/login' icon={<CgLogOut/>}/>
            </div>
        </div>
    );
}

export default SideBar;
