//Dex and limits config data I made based on PokeAPI, will need update if API gets updated
export const REGIONAL_POKEDEX = [
  {
    name: "National Dex",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=1025",
    id: "national",
  },
  {
    name: "Kanto",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=151",
    id: "kanto",
  },
  {
    name: "Johto",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=100&offset=151",
    id: "johto",
  },
  {
    name: "Hoenn",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=135&offset=251",
    id: "hoenn",
  },
  {
    name: "Sinnoh",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=107&offset=386",
    id: "sinnoh",
  },
  {
    name: "Unova",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=156&offset=493",
    id: "unova",
  },
  {
    name: "Kalos",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=72&offset=649",
    id: "kalos",
  },
  {
    name: "Alola",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=88&offset=721",
    id: "alola",
  },
  {
    name: "Galar",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=96&offset=809",
    id: "galar",
  },
  {
    name: "Paldea",
    url: "https://pokeapi.co/api/v2/pokemon/?limit=120&offset=905",
    id: "paldea",
  },
];