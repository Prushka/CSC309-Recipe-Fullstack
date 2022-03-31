/*
 * Copyright 2022 Dan Lyu
 */

import {
    getObjectIdFromPara,
    getUserFromSession,
    removeFromOutput,
    route,
    updateUser,
    validateUser
} from "../utils/util";
import {IUser, Role, User} from "../models/user";
import express from "express";

export const userRouter = express.Router()
userRouter.delete('/',
    route(async (req, res) => {
        validateUser(req)
        const user = await getUserFromSession(req)
        await user!.delete()
        req.session.user = undefined
        res.send("Deleted")
    }))

userRouter.delete('/:id',
    route(async (req, res) => {
        validateUser(req, Role.ADMIN)
        const id = getObjectIdFromPara(req)
        let user: IUser | null = await User.findById(id)
        if (!user) {
            res.send("User cannot be found")
            return
        }
        await user.delete()
        res.send()
    }))

userRouter.get('/',
    route(async (req, res) => {
        validateUser(req)
        res.send(req.session.user)
    }))

userRouter.get('/all', route(async (req, res) => {
    validateUser(req, Role.ADMIN)
    res.send(removeFromOutput(await User.find(), "password"))
}))

userRouter.patch('/:id', route(async (req, res) => {
    validateUser(req, Role.ADMIN)
    const id = getObjectIdFromPara(req)
    let user: IUser | null = await User.findById(id)
    if (!user) {
        res.send("User cannot be found")
        return
    }

    const updatedUser = await updateUser(req, res, user)
    if (!updatedUser) {
        return
    }
    updatedUser.role = req.body.role ?? updatedUser.role
    user = await updatedUser.save()
    user = removeFromOutput(user, "password")
    res.send(user)
}))

userRouter.patch('/', route(async (req, res) => {
    validateUser(req)
    let user = await getUserFromSession(req)

    const updatedUser = await updateUser(req, res, user)
    if (!updatedUser) {
        return
    }
    user = await updatedUser.save()
    user = removeFromOutput(user, "password")
    req.session.user = user
    res.send(user)
}));

userRouter.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});

userRouter.post('/login', route(async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    let user = await User.findByEmailPassword(email, password)
    if (!user) {
        res.status(400).send("Invalid Email/Password combination")
        return
    }
    user = removeFromOutput(user, "password")
    req.session.user = user
    res.send(user)
}));

userRouter.post('/register', route(async (req, res) => {
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    const preUser = await User.findByEmailName(email, name)
    if (preUser) {
        res.status(400).send("User exists (same email or same name)")
        return
    }
    let user = new User({
        name: name,
        email: email,
        avatar: req.body.avatar,
        password: password
    })
    user = await user.save()
    res.send(user)
}));