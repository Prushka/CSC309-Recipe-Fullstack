import express, {Request, Response} from 'express';
import * as bodyParser from "body-parser";
import {IUser, Role, User} from "./models/user";
import connectToMongoDB from "./db/mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import {Recipe} from "./models/recipe";
import {
    updateUser,
    createAdminIfNotExist,
    getObjectIdFromPara, removeFromOutput,
    userHasEditingPermissionOnRecipe,
    validateUser, route
} from "./utils/util";

const {ObjectId} = require('mongodb');
connectToMongoDB().catch(err => console.log(err))

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(
    session({
        secret: process.env.SESSION_SECRET || "V^FTpiZvvFmPfX6RLcz", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000,
            httpOnly: true
        },
        // store the sessions on the database in production
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/RecipeAPI'
        })
    })
);

app.delete('/recipe/:id', route(async (req, res) => {
    const id = getObjectIdFromPara(req)
    validateUser(req)
    const user: IUser = req.session.user!
    let recipe = await Recipe.findById(id)
    if (recipe) {
        if (!userHasEditingPermissionOnRecipe(user, recipe)) {
            res.status(401).send("You don't have permission to edit this recipe")
            return
        }
        recipe = await recipe.delete()
        res.send(recipe)
    } else {
        res.status(404).send("Recipe not found")
    }
}))

app.patch('/recipe/:id', route(async (req, res) => {
    validateUser(req)
    const id = getObjectIdFromPara(req)

    const user: IUser = req.session.user!
    let recipe = await Recipe.findById(id)
    if (recipe) {
        if (!userHasEditingPermissionOnRecipe(user, recipe)) {
            res.status(401).send("You don't have permission to edit this recipe")
            return
        }
        recipe.title = req.body.title ?? recipe.title
        recipe.content = req.body.content ?? recipe.content
        recipe.category = req.body.category ?? recipe.category
        recipe.tags = req.body.tags ?? recipe.tags
        if (user.role > Role.USER) {
            recipe.approved = req.body.approved ?? recipe.approved
        }
        recipe = await recipe.save()
        res.send(recipe)
    } else {
        res.status(404).send("Recipe not found")
    }
}))

app.post('/recipe', route(async (req, res) => {
    validateUser(req)
    let recipe = new Recipe({
        title: req.body.title,
        category: req.body.category,
        content: req.body.content,
        author: req.session.user!._id,
        tags: req.body.tags
    })
    recipe = await recipe.save()
    res.send(recipe)
}))

app.get('/recipe/me', route(async (req, res) => {
    validateUser(req)
    const id = ObjectId(req.session.user!._id)
    res.send(await Recipe.findRecipeByUser(id))
}))

app.get('/recipe/:id', route(async (req, res) => {
        const id = getObjectIdFromPara(req)
        res.send(await Recipe.findRecipeByUser(id))
    })
)

app.get('/recipe', route(async (req, res) => {
    validateUser(req)
    res.send(await Recipe.find())
}))

app.get('/user',
    route(async (req, res) => {
        validateUser(req)
        res.send(req.session.user)
    }))

app.get('/users', route(async (req, res) => {
    validateUser(req, Role.ADMIN)
    res.send(removeFromOutput(await User.find(), "password"))
}))

app.patch('/user/:id', route(async (req, res) => {
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

app.patch('/user', route(async (req, res) => {
    validateUser(req)
    const sessionUser = req.session.user!
    let user = await User.findByEmailName(sessionUser.email, sessionUser.name)

    const updatedUser = await updateUser(req, res, user)
    if (!updatedUser) {
        return
    }
    user = await updatedUser.save()
    user = removeFromOutput(user, "password")
    req.session.user = user
    res.send(user)
}));

app.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send()
        }
    });
});

app.post('/login', route(async (req, res) => {
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

app.post('/register', route(async (req, res) => {
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

const port = process.env.PORT || 5001
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});
createAdminIfNotExist().then()