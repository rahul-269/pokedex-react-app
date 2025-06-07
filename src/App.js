import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./App.css";
import Popup from "./Components/Popup";
import GetPokemon from "./Components/GetPokemon";
import { REGIONAL_POKEDEX } from "./data/regionalDex";
import { motion } from "framer-motion";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  console.log(selectedPokemon);
  const [activeRegion, setActiveRegion] = useState("national");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //current region data from the data we added using the active region user selected
  const currentRegion = useMemo(
    () =>
      REGIONAL_POKEDEX.find((region) => region.id === activeRegion) ||
      REGIONAL_POKEDEX[0],
    [activeRegion]
  );

  //fetch from pokeapi using the url from the object we made based on limits
  const fetchPokemonList = useCallback(async (url) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      //No data other than name was available here for the list so we use the index to number them as ids
      //index doesnt work on filter
      const pokemonWithIds = data.results.map((pokemon, index) => ({
        ...pokemon,
        // id: index + 1,
        // displayId: String(parseInt(index + 1)).padStart(3, "0"),
        id: pokemon.url.split("/")[6],
        displayId: String(parseInt(pokemon.url.split("/")[6])).padStart(3, "0"),
      }));

      setPokemonList(pokemonWithIds);
    } catch (error) {
      console.error("Error fetching Pokemon list:", error);
      setError("Failed to load Pokemon data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  //whenever region changes we update the list
  useEffect(() => {
    fetchPokemonList(currentRegion.url);
  }, [currentRegion.url, fetchPokemonList]);

  //we let them serach based on name and number
  const filteredPokemon = useMemo(() => {
    if (!searchValue.trim()) return pokemonList;

    return pokemonList.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        pokemon.displayId.includes(searchValue)
    );
  }, [pokemonList, searchValue]);

  const handleRegionChange = useCallback((regionId) => {
    setActiveRegion(regionId);
    setSearchValue(""); //clear search when we change region
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  //When they click a card we handle it here to open dialog
  const handlePokemonClick = useCallback(async (pokemonUrl) => {
    try {
      setIsLoading(true);
      const selectedPokemonData = await GetPokemon(pokemonUrl);
      setSelectedPokemon(selectedPokemonData.selectedPokemonData);

      // Disable body scroll when popup is open , not working so we moved to useeffect
      //   document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
      setError("Failed to load Pokemon details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  //dialog close
  const handleClosePopup = useCallback(() => {
    setSelectedPokemon(null);
    // also not working moved to useeffect
    // document.body.style.overflow = "unset";
  }, []);

  //basic keyboard nav and the scrollbar hide on body here now
  useEffect(() => {
    if (selectedPokemon) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleKeyPress = (event) => {
      if (event.key === "Escape" && selectedPokemon) {
        handleClosePopup();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      //body scroll reset here now
      document.body.style.overflow = "auto";
    };
  }, [selectedPokemon, handleClosePopup]);

  //loading screen
  // if (isLoading || pokemonList.length === 0) {
  //   return (
  //     <motion.div
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       exit={{ opacity: 0 }}
  //       className="loading-overlay"
  //     >
  //       <div className="loading-content">
  //         <div className="pokeball-loader">
  //           <div className="pokeball">
  //             <div className="pokeball-top"></div>
  //             <div className="pokeball-middle"></div>
  //             <div className="pokeball-bottom"></div>
  //             <div className="pokeball-center"></div>
  //           </div>
  //         </div>
  //         <p className="loading-text">Loading Pokémon...</p>
  //         <div className="loading-dots">
  //           <span>.</span>
  //           <span>.</span>
  //           <span>.</span>
  //         </div>
  //       </div>
  //     </motion.div>
  //   );
  // }

  //error screen
  if (error && pokemonList.length === 0) {
    return (
      <div className="error-state">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => fetchPokemonList(currentRegion.url)}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">POKÉDEX</h1>
        <p className="header-subtitle">
          Discover and explore the world of Pokémon
        </p>
      </header>

      {/*navigation buttons we map over using the dummy data we made*/}
      <nav className="nav">
        <div className="regional-dex">
          {REGIONAL_POKEDEX.map((region) => (
            <button
              key={region.id}
              className={`dex-name ${
                activeRegion === region.id ? "active" : ""
              }`}
              onClick={() => handleRegionChange(region.id)}
              aria-pressed={activeRegion === region.id}
            >
              {region.name}
            </button>
          ))}
        </div>
      </nav>

      {/*search bar container, swap out better icon when u get time*/}
      <section className="search">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            onChange={handleSearchChange}
            value={searchValue}
            placeholder="Search Name Or Dex Number..."
            aria-label="Search Pokemon"
          />
        </div>
      </section>

      {/*central list we display*/}
      <main className="main">
        {filteredPokemon.length === 0 && searchValue ? (
          <div className="empty-state">
            <h3>No Pokémon found</h3>
            <p>
              Try adjusting your search terms or explore a different region.
            </p>
          </div>
        ) : (
          <div className="pokedex-list">
            {filteredPokemon.map((pokemon) => (
              <article
                key={pokemon.name}
                className="pokemon fade-in"
                onClick={() => handlePokemonClick(pokemon.url)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handlePokemonClick(pokemon.url);
                  }
                }}
                aria-label={`View details for ${pokemon.name}`}
              >
                <div className="pokemon-image-container" key={pokemon.id}>
                  <img
                    key={pokemon.id}
                    // src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt={pokemon.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png`;
                    }}
                  />
                </div>
                <h3 className="pokemon-name">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h3>
                <p className="pokemon-id">#{pokemon.displayId}</p>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p className="footer-subtitle">
          This is a personal project and is not affiliated with "The Pokémon
          Company" and does not own or claim any rights to any Nintendo
          trademark or the Pokémon trademark.
        </p>
      </footer>

      {/*pokedex anime style dialog attempt , idk if i should remove the dpad*/}
      {selectedPokemon && (
        <div
          className="popup-overlay"
          onClick={handleClosePopup}
          role="dialog"
          aria-modal="true"
        >
          <Popup
            pokemon={selectedPokemon}
            onClose={handleClosePopup}
            onClick={(e) => e.stopPropagation()} //prevent closing when clicking inside the dialog
          />
        </div>
      )}

      {/*loading overlay for pokemon details, should make this a pokeball or something*/}
      {isLoading && selectedPokemon === null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="loading-overlay"
        >
          <div className="loading-content">
            <div className="pokeball-loader">
              <div className="pokeball">
                <div className="pokeball-top"></div>
                <div className="pokeball-middle"></div>
                <div className="pokeball-bottom"></div>
                <div className="pokeball-center"></div>
              </div>
            </div>
            <p className="loading-text">Loading Pokémon...</p>
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default App;
