const pokemonList = [
  //type Pokemon : Normal
  {
    id: 1,
    name: "Eevee",
    type: "normal",
    hp: 60,
    attack: 40,
    defense: 40,
    speed: 55,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  },
  {
    id: 2,
    name: "Snorlax",
    type: "normal",
    hp: 160,
    attack: 110,
    defense: 65,
    speed: 30,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
  },
  {
    id: 3,
    name: "Tauros",
    type: "normal",
    hp: 75,
    attack: 100,
    defense: 95,
    speed: 110,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/128.png",
  },

  //type Pokemon : Feu
  {
    id: 4,
    name: "Charizard",
    type: "fire",
    hp: 78,
    attack: 84,
    defense: 78,
    speed: 100,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    id: 5,
    name: "Arcanine",
    type: "fire",
    hp: 90,
    attack: 110,
    defense: 80,
    speed: 95,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png",
  },
  {
    id: 6,
    name: "Flareon",
    type: "fire",
    hp: 65,
    attack: 130,
    defense: 60,
    speed: 65,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png",
  },

  //type Pokemon : Eau
  {
    id: 7,
    name: "Blastoise",
    type: "water",
    hp: 79,
    attack: 83,
    defense: 100,
    speed: 78,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
  },
  {
    id: 8,
    name: "Vaporeon",
    type: "water",
    hp: 130,
    attack: 65,
    defense: 60,
    speed: 65,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png",
  },
  {
    id: 9,
    name: "Gyarados",
    type: "water",
    hp: 95,
    attack: 125,
    defense: 79,
    speed: 81,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png",
  },

  //type Pokemon : Terre
  {
    id: 10,
    name: "Venusaur",
    type: "grass",
    hp: 80,
    attack: 82,
    defense: 83,
    speed: 80,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
  },
  {
    id: 11,
    name: "Leafeon",
    type: "grass",
    hp: 65,
    attack: 110,
    defense: 130,
    speed: 95,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/470.png",
  },
  {
    id: 12,
    name: "Exeggutor",
    type: "grass",
    hp: 95,
    attack: 95,
    defense: 85,
    speed: 55,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png",
  },

  //type Pokemon : electric
  {
    id: 13,
    name: "Pikachu",
    type: "electric",
    hp: 35,
    attack: 55,
    defense: 40,
    speed: 90,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    id: 14,
    name: "Jolteon",
    type: "electric",
    hp: 65,
    attack: 65,
    defense: 60,
    speed: 130,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png",
  },
  {
    id: 15,
    name: "Electabuzz",
    type: "electric",
    hp: 65,
    attack: 83,
    defense: 57,
    speed: 105,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/125.png",
  },

  //type Pokemon : Psychic
  {
    id: 16,
    name: "Mewtwo",
    type: "psychic",
    hp: 106,
    attack: 110,
    defense: 90,
    speed: 130,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
  },
  {
    id: 17,
    name: "Alakazam",
    type: "psychic",
    hp: 55,
    attack: 50,
    defense: 45,
    speed: 120,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png",
  },
  {
    id: 18,
    name: "Espeon",
    type: "psychic",
    hp: 65,
    attack: 65,
    defense: 60,
    speed: 110,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png",
  },

  //autres Pokémons
  {
    id: 19,
    name: "Dragonite",
    type: "dragon",
    hp: 91,
    attack: 134,
    defense: 95,
    speed: 80,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
  },
  {
    id: 20,
    name: "Gengar",
    type: "ghost",
    hp: 60,
    attack: 65,
    defense: 60,
    speed: 110,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
  },
  {
    id: 21,
    name: "Machamp",
    type: "fighting",
    hp: 90,
    attack: 130,
    defense: 80,
    speed: 55,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png",
  },
  {
    id: 22,
    name: "Tyranitar",
    type: "rock",
    hp: 100,
    attack: 134,
    defense: 110,
    speed: 61,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png",
  },
  {
    id: 23,
    name: "Umbreon",
    type: "dark",
    hp: 95,
    attack: 65,
    defense: 110,
    speed: 65,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png",
  },
  {
    id: 24,
    name: "Sylveon",
    type: "fairy",
    hp: 95,
    attack: 65,
    defense: 65,
    speed: 60,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png",
  },
  {
    id: 25,
    name: "Garchomp",
    type: "dragon",
    hp: 108,
    attack: 130,
    defense: 95,
    speed: 102,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png",
  },
  {
    id: 26,
    name: "Lucario",
    type: "fighting",
    hp: 70,
    attack: 110,
    defense: 70,
    speed: 90,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
  },
  {
    id: 27,
    name: "Scizor",
    type: "bug",
    hp: 70,
    attack: 130,
    defense: 100,
    speed: 65,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/212.png",
  },
  {
    id: 28,
    name: "Glaceon",
    type: "ice",
    hp: 65,
    attack: 60,
    defense: 110,
    speed: 65,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/471.png",
  },
  {
    id: 29,
    name: "Toxtricity",
    type: "poison",
    hp: 75,
    attack: 98,
    defense: 70,
    speed: 75,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/849.png",
  },
  {
    id: 30,
    name: "Steelix",
    type: "steel",
    hp: 75,
    attack: 85,
    defense: 200,
    speed: 30,
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png",
  },
];

//tirer 5 cartes aléatoires et retourne un array des objets
export function drawPack() {
  let packCards = [];
  const availableIndices = Array.from(
    { length: pokemonList.length },
    (_, i) => i
  );

  //tirer 5 cartes aléatoires
  for (let i = 0; i < 5; i++) {
    if (availableIndices.length === 0) break;

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const pokemonIndex = availableIndices[randomIndex];

    //eviter la duplication utilisant l'index
    availableIndices.splice(randomIndex, 1);

    packCards.push(pokemonList[pokemonIndex]);
  }

  return packCards;
}
