import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    // Fetch the list of Pokemon from the PokeAPI
    fetch('https://pokeapi.co/api/v2/pokemon')
      .then((response) => response.json())
      .then((data) => setPokemonList(data.results))
      .catch((error) => console.log(error));
       
  }, []);

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
                <div key={pokemon.name} className="pokemon">
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
    </div>
  );
};

export default App;



