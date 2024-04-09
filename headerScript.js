let currentSearchTerm = "";

async function searchPokemon() {
  currentSearchTerm = document.querySelector(".inputfield").value.toLowerCase();
  let foundPokemon = pokemonDataArray.find((pokemon) =>
    pokemon.name.startsWith(currentSearchTerm)
  );
  if (foundPokemon) {
    let foundIndex = pokemonDataArray.indexOf(foundPokemon);
    createPopup(foundIndex);
  } else {
    alert("Pokemon not found!");
  }
}

function loadPreviousPokemon(index) {
  if (index > 0) {
    let prevIndex = index - 1;
    while (
      prevIndex >= 0 &&
      !pokemonDataArray[prevIndex].name.startsWith(currentSearchTerm)
    ) {
      prevIndex--;
    }
    if (prevIndex >= 0) {
      createPopup(prevIndex);
    }
  }
}

function loadNextPokemon(index) {
  if (index < pokemonDataArray.length - 1) {
    let nextIndex = index + 1;
    while (
      nextIndex < pokemonDataArray.length &&
      !pokemonDataArray[nextIndex].name.startsWith(currentSearchTerm)
    ) {
      nextIndex++;
    }
    if (nextIndex < pokemonDataArray.length) {
      createPopup(nextIndex);
    }
  }
}
