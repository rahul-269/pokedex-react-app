import React, { useState, useEffect } from 'react';
import './App.css';
import Popup from './Components/Popup';
import GetPokemon from './Components/GetPokemon';

const App = () => {
  
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
      fetchPokemonList();
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1010');
      const data = await response.json();
      setPokemonList(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  const capitalizeFirst = (pname) => {
    return (
      pname.charAt(0).toUpperCase() + pname.slice(1).toLowerCase()
    );
  };

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
      document.documentElement.style.setProperty('pointer-events', `none`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClosePopup = () => {
    setSelectedPokemon(null);
    document.documentElement.style.setProperty('pointer-events', `auto`);
  };

  return (
    <div>
      <header>
        <h1 className="header-title">POKEDEX</h1>
      </header>

      <main className="main">
        <div className="pokedex-list">
          {Array.from({ length: Math.ceil(pokemonList.length / 5) }, (_, rowIndex) => (
            <div key={rowIndex} className="row">
              {pokemonList.slice(rowIndex * 5, rowIndex * 5 + 5).map((pokemon) => (
                <div
                  key={pokemon.name}
                  className="pokemon"
                  onClick={() => handlePokemonClick(pokemon.url)}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`}
                    alt={pokemon.name}
                  />
                  <p>{capitalizeFirst(pokemon.name)}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {selectedPokemon && <Popup pokemon={selectedPokemon} onClose={handleClosePopup} />}
    </div>
  );
};

export default App;
