import React, { useState, useEffect } from "react";
import "./App.css";
import Popup from "./Components/Popup";
import GetPokemon from "./Components/GetPokemon";

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [listurl, setListurl] = useState(
    "https://pokeapi.co/api/v2/pokemon/?limit=1025"
  );
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchPokemonList(listurl);
  }, [listurl]);

  const fetchPokemonList = async (listurl) => {
    try {
      const response = await fetch(listurl);
      const data = await response.json();
      setPokemonList(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  /*useEffect(() => {
    
    const searchlist = pokemonList.filter((pokemon) => pokemon.name.toLowerCase().includes(searchValue.toLowerCase()));
    setPokemonList(searchlist);
  },[searchValue]);

  const filterPokemonList = (e) =>{
     const searchlist = pokemonList.filter((pokemon) => {
        if(e.target.value === "")
        return pokemon;
        else if(pokemon.name.toLowerCase().includes(e.target.value.toLowerCase()))
        return pokemon;
     });
     setPokemonList(searchlist);
  };*/

  const handlePokemonClick = async (urls) => {
    try {
      /*const response = await fetch(pokemon.url);
      const data = await response.json();
      console.log(data);
      const selectedPokemonData = {
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
        name: data.name,
        length: data.types.length,
        type: data.types,
        abilities: data.abilities,
        id: data.id,
        height: data.height,
        weight: data.weight,
        stats: data.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
      };*/
      const selectedPokemonData = await GetPokemon(urls);
      setSelectedPokemon(selectedPokemonData.selectedPokemonData);
      document.documentElement.style.setProperty("pointer-events", `none`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClosePopup = () => {
    setSelectedPokemon(null);
    document.documentElement.style.setProperty("pointer-events", `auto`);
  };

  return (
    <div>
      <header>
        <h1 className="header-title">POKEDEX</h1>
      </header>

      <nav>
        <div className="regional-dex">
          <div
            className="dex-name"
            onClick={() =>
              setListurl("https://pokeapi.co/api/v2/pokemon/?limit=1025")
            }
          >
            National Dex
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl("https://pokeapi.co/api/v2/pokemon/?limit=151")
            }
          >
            Kanto
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl(
                "https://pokeapi.co/api/v2/pokemon/?limit=100&offset=151"
              )
            }
          >
            Johto
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl(
                "https://pokeapi.co/api/v2/pokemon/?limit=135&offset=251"
              )
            }
          >
            Hoenn
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl(
                "https://pokeapi.co/api/v2/pokemon/?limit=107&offset=386"
              )
            }
          >
            Sinnoh
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl(
                "https://pokeapi.co/api/v2/pokemon/?limit=156&offset=493"
              )
            }
          >
            Unova
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl(
                "https://pokeapi.co/api/v2/pokemon/?limit=72&offset=649"
              )
            }
          >
            Kalos
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl(
                "https://pokeapi.co/api/v2/pokemon/?limit=88&offset=721"
              )
            }
          >
            Alola
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl(
                "https://pokeapi.co/api/v2/pokemon/?limit=96&offset=809"
              )
            }
          >
            Galar
          </div>
          <div
            className="dex-name"
            onClick={() =>
              setListurl(
                "https://pokeapi.co/api/v2/pokemon/?limit=120&offset=905"
              )
            }
          >
            Paldea
          </div>
        </div>
      </nav>

      <div className="search">
        <input
          type="text"
          className="search-input"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          placeholder="Filter By Pokemon Name"
        />
      </div>

      <main className="main">
        <div className="pokedex-list">
          {Array.from(
            { length: Math.ceil(pokemonList.length / 5) },
            (_, rowIndex) => (
              <div key={rowIndex} className="row">
                {pokemonList
                  .filter((pokemon) =>
                    pokemon.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  )
                  .slice(rowIndex * 5, rowIndex * 5 + 5)
                  .map((pokemon) => (
                    <div
                      key={pokemon.name}
                      className="pokemon"
                      onClick={() => handlePokemonClick(pokemon.url)}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                          pokemon.url.split("/")[6]
                        }.png`}
                        alt={pokemon.name}
                      />
                      <p>
                        {pokemon.name.charAt(0).toUpperCase() +
                          pokemon.name.slice(1).toLowerCase()}
                      </p>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>
      </main>

      {selectedPokemon && (
        <Popup pokemon={selectedPokemon} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default App;
