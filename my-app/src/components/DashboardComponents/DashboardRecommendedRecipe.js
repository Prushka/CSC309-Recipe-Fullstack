import React from 'react'; 
import '../../styles/Dashboard.css';
import {CgHeart, CgMathPlus} from 'react-icons/cg';
import VeganFood from '../../resources/vegan-food.jpg';
import PorkChop from '../../resources/pork-chop.jpg';
import Chicken from '../../resources/chicken.jpg';
import Salmon from '../../resources/salmon.jpg';
import SweetSour from '../../resources/sweet-sour.jpg';
import {Link} from 'react-router-dom';
import {Button} from '../input/Button';

class DashboardRecommendedRecipe extends React.Component {

    getRecommendedRecipes() {
        // Hardcoded data that will be fetched from database
        return([
            {
                recipeName: 'Creamy Broccoli Vegan Pasta', 
                img: VeganFood,
                url: 1
            }, 
            {
                recipeName: 'Grilled Pork Chops with Smoked Paprika Rub',
                img: PorkChop,
                url: 2
            }, 
            {
                recipeName: 'Air-Fried Frozen Salmon',
                img: Salmon,
                url: 3
            },
            {
                recipeName: 'Golden Chicken',
                img: Chicken,
                url: 4
            },
            {
                recipeName: 'Slow Cooker Sweet and Sour Chicken Thighs',
                img: SweetSour,
                url: 5
            },
        ]);
    }

    render() {
        const recommendedRecipes = this.getRecommendedRecipes();

        return(
            <React.Fragment>
                <div class="grid-item dashboard-recommended-recipe-container">
                    <div className='grid-dashboard-recommended-recipe'>
                        Recommended Recipes For You 
                    </div>
                    {recommendedRecipes.map((recipe) => {
                        return(
                            <RecommendedRecipeItem recipe={recipe} />
                        );
                    })}
                </div> 
            </React.Fragment>
        )
    }
}

class RecommendedRecipeItem extends React.Component {

    render() {
        return(
            <div className='dashboard-recommended-recipe-item'>
                <img src={this.props.recipe.img} alt={this.props.recipe.recipeName}></img>
                <div className='dashboard-recommended-recipe-item-name'>{this.props.recipe.recipeName}</div>
                <div className='dashboard-recommended-recipe-button-container'>
                    <button className='dashboard-recommended-recipe-item-button'><CgHeart /></button>
                    <button className='dashboard-recommended-recipe-item-button'><CgMathPlus /></button>
                    <Link to={`/recipe/${this.props.recipe.url}`}><Button className='button-explore-recipe'>Explore</Button></Link>
                </div>
            </div>
        )
    }
}

export default DashboardRecommendedRecipe;