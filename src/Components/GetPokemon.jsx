const GetPokemon = async(url) => {
    
      console.log(url);
      const response =  await fetch(url);
      const data =  await response.json();
      console.log(data);
      const selectedPokemonData = {
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
        name: data.name,
        length: data.types.length,
        type: data.types,
        abilities: data.abilities,
        moves: data.moves,
        id: data.id,
        height: data.height,
        weight: data.weight,
        stats: data.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        })),
      };
      return {selectedPokemonData};
    
};

export default GetPokemon;