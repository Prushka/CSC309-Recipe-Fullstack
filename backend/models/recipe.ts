import {Document, Model, model, ObjectId, Schema} from "mongoose";
import {getFileURLFromStoredString} from "../utils/util";
import {DEFAULT_AVATAR} from "./user";

export const DEFAULT_RECIPE_THUMBNAIL = "https://s2.loli.net/2022/04/06/TOJBZgKVxko4lA6.png"

enum RecipeCategory {
    Japanese = "Japanese",
    Unknown = "Unknown"
}

export interface IRecipe extends Document {
    title: string
    category: RecipeCategory
    // content: string
    instructions: string
    ingredients: string[]
    author?: ObjectId
    tags: string[]
    approved: boolean
    thumbnail?: string
}

interface RecipeModel extends Model<IRecipe> {
    findRecipeByUser: (id: string|ObjectId) => Promise<IRecipe[]>
}

const RecipeSchema = new Schema<IRecipe, RecipeModel>({
    title: {type: String, required: true},
    category: {type: String, required: true, default: RecipeCategory.Unknown},
    // content: {type: String, required: true, default: ""},
    instructions: {type: String, required: true, default: ""},
    ingredients: [{
        type: String,
        required: true,
        default: ""
    }],
    author: {type: String},
    tags: [{
        type: String
    }],
    approved: {type: "boolean", required: true, default: false},
    thumbnail: {type: String, required: false, get:
            (thumbnail: string) => getFileURLFromStoredString(thumbnail) ?? DEFAULT_RECIPE_THUMBNAIL}
});

RecipeSchema.static('findRecipeByUser', async function findRecipeByUser(id: string) {
    const Recipe = this
    return Recipe.find({author: id})
});

RecipeSchema.pre('save', function (next) {
    const recipe = this;
    if (recipe.isModified('tags')) {
        recipe.tags = [...new Set(recipe.tags)]
        next()
    } else {
        next()
    }
})

export const Recipe = model<IRecipe, RecipeModel>('Recipe', RecipeSchema)