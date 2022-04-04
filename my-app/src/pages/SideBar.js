import {CgProfile, CgSearch, CgHomeAlt, CgHeart, CgPen, CgLogOut} from 'react-icons/cg'
import React, {useEffect} from 'react';
import '../styles/Sidebar.css';
import SideBarButton from "../components/input/SideBarButton";
import {MdManageAccounts, MdOutlinePreview} from "react-icons/md";
import {IoFastFood} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {logout, UserAPI} from "../axios/Axios";
import {setUser} from "../redux/Redux";
import {useNavigate} from "react-router-dom";

function SideBar(props) {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    useEffect(() => {
        async function fetchSession() {
            if (!user._id) {
                await UserAPI.get('', {withCredentials: true}).then(res => {
                    dispatch(setUser(res.data))
                }).catch(() => {
                    navigate('/login')
                })
            }
        }

        fetchSession().then()
    }, [dispatch, navigate, user])


    const isSelected = (path) => {
        return props.currentSelected === path ? 'selected' : ''
    }
    const WrappedSideBarButton = ({title, path, icon, onClick}) => {
        return (<SideBarButton onClick={onClick} setSideBarOpen={props.setSideBarOpen} title={title} path={path}
                               isSelected={isSelected} icon={icon}/>)
    }
    return (
        <div className={`side-bar ${props.sideBarOpen ? null : 'closed'}`} onClick={(e) => {
            e.stopPropagation();
        }}>
            <div className={'avatar__container'}>
                <img src={user.avatar} alt='avatar'/>
            </div>

            <div className={'side-bar__username'}>{user.name}</div>

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
                <WrappedSideBarButton title='Log-out' path={undefined}
                                      onClick={async () => {
                                          await logout()
                                          navigate("/login")
                                      }}
                                      icon={<CgLogOut/>}/>
            </div>
        </div>
    );
}

export default SideBar;
