async function searchPokemon(){
    getPokemonDataArray();
    let pokemonName = document.querySelector('.inputfield').value.toLowerCase();
    let pokemonData = pokemonDataArray.find(pokemon => pokemon.name === pokemonName); 
    if(pokemonData) {
        createPopup(pokemonData);
    } else {
        alert("Pokemon nicht gefunden!");
    }
}

async function fetchPokemonData(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    try {
      let response = await fetch(url);
      let data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      return null;
    }
  }



