import AdvancedGrid from "../../components/grid/AdvancedGrid";
import {useState} from "react";
import {useAsync, userIsAdmin} from "../../util";
import {RecipeAPI, ReviewAPI} from "../../axios/Axios";
import {useSnackbar} from "notistack";

export default function BrowseRecipe({}) {

    const [recipes, setRecipes] = useState([])
    const {enqueueSnackbar} = useSnackbar()

    useAsync(async () => {
        try {
            const response = await RecipeAPI.get(
                "")
            return response.data
        } catch (e) {
            enqueueSnackbar(e.response.data.message,
                {
                    variant: 'error',
                    persist: false,
                })
        }
    }, (r) => {
        setRecipes(r)
    }, [])

    return <>
        <AdvancedGrid
            excludeHeader={['_id', 'author', 'instructions', 'approved']}
            listArrayHeaders={['tags']}
            searchableHeaders={['title', 'authorName', 'category', 'tags']}
            displayData={recipes} cellCallback={(e) => {
        }}/>
    </>
}