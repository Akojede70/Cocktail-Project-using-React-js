import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
// is used for searching cocktails by name. It accepts a query parameter s which represents the search term.
// You can use this API to find cocktails that match a specific search term, for example, to search for cocktails that contain the word "Margarita".
// The response from this API will be a list of cocktails that match the search term, along with some basic information about each cocktail, such as its name and ID.
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("a");
  // a is put there to search the item for a at first load
  const [cocktails, setCocktails] = useState([]);

  const fetchDrinks = useCallback(async () => {
    // if the searchterms (searching and Input) changes it create from the scratch and  vice versa that is why we useCallback
    setLoading(true);
    // when searching it will be loading
    try {
      const response = await fetch(`${url}${searchTerm}`);
      // by loading the searchItem it search for a in the url
      const data = await response.json();
      // while waiting convert to json
      console.log(data);
      const { drinks } = data;
      // form the external api(link) drink is an array there, we put the data(i.e. converted to json) to the drink property, so that everything in the data property will be converted to Json
      // grant me the drinks Property for my data
      if (drinks) {
        const newCocktails = drinks.map((item) => {
          // drinks is an array
          const { idDrink, strDrink, strDrinkThumb, strAlcoholic, strGlass } =
            // check the api for the allocation and what it means, everything now equal to item
            item;

          return {
            id: idDrink,
            name: strDrink,
            image: strDrinkThumb,
            info: strAlcoholic,
            glass: strGlass,
            // for easy Identification we re-allocate
          };
        });
        setCocktails(newCocktails);
        // when searching setCocktails to the newCocktails if it matches the item will show
      } else {
        setCocktails([]);
        // else to the normal frontpage when not searching
      }
      setLoading(false);
      // we are not searching so no loading
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [searchTerm]);
  // to put it at the default a
  useEffect(() => {
    fetchDrinks();
    // When this component is rendered, useEffect will be called and execute the fetchDrinks() function, which likely fetches data from an external API.
    // The effect will only be re-run if the searchTerm or fetchDrinks function changes.
    // This is useful because it allows you to control when the effect is re-run to avoid unnecessary API calls and to keep your component optimized.
  }, [searchTerm, fetchDrinks]);
  // anytime the searchTerm changes create from the scratch that is why we pass the seacrhTerms
  // why because we pass in the search term from the response variable check it, otherwise we will have a, which is also the default value
  // we cant have any warning again when we search, we then add the fetch drinks as our dependency.
  return (
    <AppContext.Provider
      value={{ loading, cocktails, searchTerm, setSearchTerm }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
