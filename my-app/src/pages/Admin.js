/*
 * Copyright 2022 Dan Lyu.
 */

import * as React from 'react';
import {useState} from "react";
import '../styles/Admin.css';
import AdvancedGrid from "../components/grid/AdvancedGrid";
import {defaultReview, defaultUser, recipes, reports, reviews, users} from "../MockupData";
import {TextField} from "../components/input/TextField";
import {RadioButtonGroup} from "../components/input/RadioButtonGroup";
import {BlueBGButton, RedBGButton} from "../components/input/Button";

const userHeaders = ['Created By', 'Username', 'Recipe Author', 'Rating Author']

class Dialog {
    constructor(data, setData, editingEntity, setEditingEntity, contentGetter, footerGetter, titleGetter,
                supportedHeaders, size='m') {
        this.data = data
        this.setData = setData
        this.editingEntity = editingEntity
        this.setEditingEntity = setEditingEntity
        this.contentGetter = contentGetter
        this.footerGetter = footerGetter
        this.titleGetter = titleGetter
        this.supportedHeaders = supportedHeaders
        this.size = size
    }
}

function getReportEditingDialog(data, setData,
                              editingEntity, setEditingEntity, userHeaders) {
    return new Dialog(data, setData,
        editingEntity, setEditingEntity, () => {
            return (
                <spaced-horizontal-preferred>
                    <AdvancedGrid
                        searchableHeaders={['Report', 'Report Reason']} displayData={data}
                        setDisplayData={setData} cellCallback={cellCallback}/>
                </spaced-horizontal-preferred>
            )
        }, () => {
            return (
                <spaced-horizontal-preferred>
                    <div className={'dialog-right-button-group'}>
                    </div>
                </spaced-horizontal-preferred>
            )
        },
        () => {
            return `Reports on Someone's review'`
        }, userHeaders, 'l')
}

function getUserEditingDialog(data, setData,
                              editingEntity, setEditingEntity, userHeaders) {
    return new Dialog(data, setData,
        editingEntity, setEditingEntity, () => {
            return (
                <spaced-horizontal-preferred>
                    <TextField defaultValue={editingEntity["Username"]} label={'Username'}/>
                    <RadioButtonGroup style={{minWidth: '300px'}} title={'Role/Permission Set'}
                                      options={['Guest', 'User', 'Admin']}
                                      selected={editingEntity["Permission"]}/>
                </spaced-horizontal-preferred>
            )
        }, () => {
            return (
                <spaced-horizontal-preferred>
                    <RedBGButton>Delete User</RedBGButton>
                    <div className={'dialog-right-button-group'}>
                        <BlueBGButton>Save</BlueBGButton>
                    </div>
                </spaced-horizontal-preferred>
            )
        },
        () => {
            return `Managing ${editingEntity["Username"]}`
        }, userHeaders)
}

function cellCallback(header, value, id, cellId, isHeader) {
    console.log(`header: [${header}], value: [${value}], id: [${id}], cellId: [${cellId}], isHeader: [${isHeader}]`)
}

export function AdminReviews() {
    const [editingUser, setEditingUser] = useState(defaultUser)
    const [editingReview, setEditingReview] = useState(defaultReview)
    const [userData, setUserData] = useState(users)
    const [reviewsData, setReviewsData] = useState(reviews)
    const [reportData, setReportData] = useState(reports)

    return <AdvancedGrid
        headerDialogs={[getUserEditingDialog(userData, setUserData,
            editingUser, setEditingUser, userHeaders),
            getReportEditingDialog(reportData, setReportData,
                editingReview, setEditingReview, ["Posted At"])]}
        searchableHeaders={["Recipe", "Recipe Author", "Rating", "Rating Author", "Public"]}
        displayData={reviewsData} setDisplayData={setReviewsData}
        cellCallback={cellCallback}/>
}


export function AdminManageUsers() {
    const [editingUser, setEditingUser] = useState(defaultUser)
    const [userData, setUserData] = useState(users)

    return <AdvancedGrid headerDialogs={[getUserEditingDialog(userData, setUserData,
        editingUser, setEditingUser, userHeaders)]}
                         searchableHeaders={["Username", "Permission", "Email", "Uploaded Recipes"]}
                         displayData={userData} setDisplayData={setUserData}
                         cellCallback={cellCallback}/>
}

export function AdminManageRecipes() {
    const [editingUser, setEditingUser] = useState(defaultUser)
    const [userData, setUserData] = useState(users)
    const [recipeData, setRecipeData] = useState(recipes)

    return <AdvancedGrid
        headerDialogs={[getUserEditingDialog(userData, setUserData,
            editingUser, setEditingUser, userHeaders)]}
        searchableHeaders={['Recipe Name', 'Category', 'Created By']} displayData={recipeData}
        setDisplayData={setRecipeData} cellCallback={cellCallback}/>
}