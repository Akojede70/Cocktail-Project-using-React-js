import React from "react";
import Loading from "../components/Loading";
import { useParams, Link } from "react-router-dom";

export default function SingleCocktail() {
  const { id } = useParams();
  // The useParams() hook is used to access the parameters of the current route. It returns an object containing key-value pairs of the URL parameters.
  const [loading, setLoading] = React.useState(false);
  // React.useState is an alternative but we didn't import useState
  const [cocktail, setCocktail] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    async function getCocktail() {
      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
          // is used for retrieving a specific cocktail by its ID. It accepts a query parameter i which represents the ID of the cocktail.
          // You can use this API to retrieve detailed information about a specific cocktail, such as its name, ingredients, instructions for making it, and images.
          // This API is useful if you want to display detailed information about a specific cocktail, for example, if you have a page dedicated to a specific cocktail and you want to display all the information about it.
        );
        const data = await response.json();
        // convert to Json
        if (data.drinks) {
          const {
            strDrink: name,
            strDrinkThumb: image,
            strAlcoholic: info,
            strCategory: category,
            strGlass: glass,
            strInstructions: instructions,
            strIngredient1,
            strIngredient2,
            strIngredient3,
            strIngredient4,
            strIngredient5,
            // the one that is useful in the array(api)  was allocated the one that were not allocated were null
          } = data.drinks[0];
          // converted to json and equate everything to 0
          const ingredients = [
            strIngredient1,
            strIngredient2,
            strIngredient3,
            strIngredient4,
            strIngredient5,
            // the one that we didn't allocate that were nill
          ];
          const newCocktail = {
            name,
            image,
            info,
            category,
            glass,
            instructions,
            ingredients,
          };
          setCocktail(newCocktail);
          // the cocktail has been set to the new cocktail, i.e. when you click on the details
          // things in the i.d will display else put to the previous state i.e. (null) if you did not click on it
        } else {
          setCocktail(null);
          // go back to the default page i.e. the front page
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
      // when its null you are not loading anything i.e. false
    }
    getCocktail();
  }, [id]);
  // we are fetching data base on the ID
  if (loading) {
    // if loading is true load when you search(i.e.) when you type
    return <Loading />;
  }
  if (!cocktail) {
    //  when you search the things you search for not in the cocktail this is what will display
    return <h2 className="section-title">no cocktail to display</h2>;
  } else {
    // go back to the default the front page
    const { name, image, category, info, glass, instructions, ingredients } =
      cocktail;
    // go back to the single  cocktail we were working on
    return (
      <section className="section cocktail-section">
        <Link to="/" className="btn btn-primary">
          back home
        </Link>
        <h2 className="section-title">{name}</h2>
        <div className="drink">
          <img src={image} alt={name}></img>
          <div className="drink-info">
            <p>
              <span className="drink-data">name :</span> {name}
            </p>
            <p>
              <span className="drink-data">category :</span> {category}
            </p>
            <p>
              <span className="drink-data">info :</span> {info}
            </p>
            <p>
              <span className="drink-data">glass :</span> {glass}
            </p>
            <p>
              <span className="drink-data">instructons :</span> {instructions}
            </p>
            <p>
              <span className="drink-data">ingredients :</span>
              {ingredients.map((item, index) => {
                return item ? <span key={index}> {item}</span> : null;
              })}
            </p>
          </div>
        </div>
      </section>
    );
  }
}
