import React, { useState, useEffect } from 'react';
import './App.css';
import Popup from './Components/Popup';

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

  const handlePokemonClick = async (pokemon) => {
    try {
      const response = await fetch(pokemon.url);
      const data = await response.json();
      console.log(data);
      const selectedPokemonData = {
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
        name: data.name,
        type: data.types[0].type.name,
        height: data.height,
        weight: data.weight,
        stats: data.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
      };
      setSelectedPokemon(selectedPokemonData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClosePopup = () => {
    setSelectedPokemon(null);
  };

  return (
    <div>
      <header>
        <h1 className="header-title">Pokedex</h1>
      </header>

      <main>
        <div className="pokedex-list">
          {Array.from({ length: Math.ceil(pokemonList.length / 5) }, (_, rowIndex) => (
            <div key={rowIndex} className="row">
              {pokemonList.slice(rowIndex * 5, rowIndex * 5 + 5).map((pokemon) => (
                <div
                  key={pokemon.name}
                  className="pokemon"
                  onClick={() => handlePokemonClick(pokemon)}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`}
                    alt={pokemon.name}
                  />
                  <p>{pokemon.name}</p>
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
