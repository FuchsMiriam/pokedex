async function searchPokemon() {
  let searchInput = document.querySelector(".inputfield").value.toLowerCase();
  let foundPokemon = pokemonDataArray.find(pokemon => pokemon.name === searchInput);
  if (foundPokemon) {
    let foundIndex = pokemonDataArray.indexOf(foundPokemon);
    createPopup(foundIndex);
  } else {
    alert("Pokemon not found!");
  }
}


