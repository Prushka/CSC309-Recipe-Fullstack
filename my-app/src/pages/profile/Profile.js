/*
 * Copyright 2022 Dan Lyu.
 */
import './Profile.css';
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {TextField} from "../../components/input/TextField";
import {BlueBGButton, GreyBorderRedButton, RedBGButton} from "../../components/input/Button";
import {getUserRoleDisplay, roles} from "../../util";
import Dialog from "../../components/dialog/Dialog";
import PasswordTextField from "../../components/input/PasswordTextField";
import {FileUploadAPI, getAllFollowerUsers, getAllFollowingUsers, UserAPI} from "../../axios/Axios";
import {useSnackbar} from "notistack";
import AdvancedGrid from "../../components/grid/AdvancedGrid";
import {RadioButtonGroup} from "../../components/input/RadioButtonGroup";
import {setUser} from "../../redux/Redux";

export default function Profile({
                                    user, setEditingUser = () => {
    }
                                }) {
    const loggedInUser = useSelector((state) => state.user)
    const [username, setUsername] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [updatePasswordDialogOpen, setUpdatePasswordDialogOpen] = useState(false)
    const [followingUserDialogOpen, setFollowingUserDialogOpen] = useState(false)
    const [followersDialogOpen, setFollowersDialogOpen] = useState(false)
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const [passwordInputType, setPasswordInputType] = useState("password")
    const {enqueueSnackbar} = useSnackbar()
    const dispatch = useDispatch()
    const [following, setFollowing] = useState([])
    const [followers, setFollowers] = useState([])
    const [selectedFile, setSelectedFile] = useState(null)
    const [selectedRole, setSelectedRole] = useState(getUserRoleDisplay(user.role))
    const editingMyProfile = loggedInUser._id === user._id
    const updateMyUserInfo = async () => {
        if (password !== repeatPassword) {
            enqueueSnackbar(`Your passwords don't match (Repeat Password and Password)`,
                {
                    variant: 'error',
                    persist: false,
                })
            return
        }
        let avatar = ""
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            try {
                const response = await FileUploadAPI.post("", formData)
                avatar = response.data['storeWith']
            } catch (error) {
                enqueueSnackbar(`${error.response.data.message}`,
                    {
                        variant: 'error',
                        persist: false,
                    })
            }
        }
        let updatePayload = {"name": username, "email": email, "role": roles[selectedRole]}
        if (password) {
            updatePayload = {...updatePayload, "password": password}
        }
        if (avatar) {
            updatePayload = {...updatePayload, "avatar": avatar}
        }
        await UserAPI.patch(`/${user._id}`,
            updatePayload).then(res => {
            if (editingMyProfile) {
                dispatch(setUser(res.data))
            }
            setEditingUser(res.data)
            enqueueSnackbar(`Successfully updated the user profile`,
                {
                    variant: 'success',
                    persist: false,
                })
        }).catch(error => {
            enqueueSnackbar(`${error.response.data.message}`,
                {
                    variant: 'error',
                    persist: false,
                })
        })
    }

    return (
        <div className={'profile__container'}>
            <Dialog title={"Edit Password"} open={updatePasswordDialogOpen}
                    onClose={() => setUpdatePasswordDialogOpen(false)}
                    content={
                        <>
                            <PasswordTextField password={password} setPassword={setPassword}
                                               passwordInputType={passwordInputType}
                                               className="auth__input" setPasswordInputType={setPasswordInputType}/>

                            <TextField value={repeatPassword} setValue={setRepeatPassword} type={passwordInputType}
                                       className="auth__input"
                                       label={'Repeat Password'}/>

                        </>
                    }
                    footer={<>

                        <RedBGButton type={'reset'} onClick={() => {
                            setPassword('')
                            setRepeatPassword('')
                        }
                        }>Clear Password Input</RedBGButton>
                    </>
                    }/>

            <Dialog title={"Edit Following Users"} open={followingUserDialogOpen}
                    onClose={() => setFollowingUserDialogOpen(false)}
                    content={
                        <AdvancedGrid
                            searchableHeaders={['name']} displayData={following}
                            excludeHeader={['_id', 'following', 'followers']}/>
                    }
                    footer={<>
                    </>
                    }/>

            <Dialog title={"Followers"} open={followersDialogOpen}
                    onClose={() => setFollowersDialogOpen(false)}
                    content={
                        <AdvancedGrid
                            searchableHeaders={['name']} displayData={followers}
                            excludeHeader={['_id', 'following', 'followers']}/>
                    }
                    footer={<>
                    </>
                    }/>
            <div className={"avatar__container"}>
                <img src={user.avatar} alt='avatar'/>
            </div>

            <input type="file" id="img" name="img" accept="image/*"
                   onChange={(e) => {
                       setSelectedFile(e.target.files[0])
                   }}/>
            <div className={"profile__follow-container"}>
                <GreyBorderRedButton
                    className={"profile__dialog__button"}
                    onClick={async () => {
                        getAllFollowerUsers(user).then(users => {
                            setFollowers(users)
                            setFollowersDialogOpen(true)
                        })
                    }}>Followers: {user.followers.length}</GreyBorderRedButton>
                <GreyBorderRedButton
                    className={"profile__dialog__button"}
                    onClick={async () => {
                        getAllFollowingUsers(user).then(users => {
                            setFollowing(users)
                            setFollowingUserDialogOpen(true)
                        })
                    }}
                >Following: {user.following.length}</GreyBorderRedButton>
            </div>


            <TextField value={username} setValue={setUsername}
                       type="username"
                       className="profile__input"
                       textFieldClassName="profile__input"
                       label={'Username'}/>
            <TextField value={email} setValue={setEmail}
                       type="email"
                       className="profile__input"
                       textFieldClassName="profile__input"
                       label={'Email'}/>
            {editingMyProfile ? <TextField
                    disabled={true}
                    value={getUserRoleDisplay(user.role)}
                    className="profile__input"
                    textFieldClassName="profile__input"
                    label={'Role'}/> :
                <RadioButtonGroup className={'profile__radio'}
                                  title={'Role'}
                                  options={Object.keys(roles)}
                                  selected={selectedRole}
                                  setSelected={(id) => {
                                      setSelectedRole(id)
                                  }
                                  }/>
            }


            <BlueBGButton className={'profile__save-button'} onClick={() => setUpdatePasswordDialogOpen(true)}>Update
                Password</BlueBGButton>
            <BlueBGButton className={'profile__save-button'}
                          onClick={async () => await updateMyUserInfo()}>Save</BlueBGButton>
        </div>
    )
}