let currentBatch = 1;
let cardIndex = 1;
let pokemonDataArray = [];

function getPokemonDataArray() {
  return pokemonDataArray;
}

//Daten holen
async function fetchPokemonNames(startIndex, endIndex) {
  let url = `https://pokeapi.co/api/v2/pokemon/?limit=${
    endIndex - startIndex + 1
  }&offset=${startIndex}`;
  try {
    let response = await fetch(url);
    let data = await response.json();
    let pokemonNames = data.results.map((pokemon) => pokemon.name);
    return pokemonNames;
  } catch (error) {
    console.error("Error fetching Pokemon names:", error);
    return [];
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

document
  .getElementById("loadMoreButton")
  .addEventListener("click", async function () {
    currentBatch++;
    await loadPokemon();
  });

async function loadPokemon() {
  let startIndex = (currentBatch - 1) * 4;
  let endIndex = currentBatch * 4;

  let pokemonNames = await fetchPokemonNames(startIndex + 1, endIndex);

  for (let i = 0; i < pokemonNames.length; i++) {
    let pokemonName = pokemonNames[i];
    let pokemonData = await fetchPokemonData(pokemonName);
    if (pokemonData) {
      pokemonDataArray.push(pokemonData);
      createCard(pokemonData);
      cardIndex++;
    }
  }
}

//Karte erstellen
function createCard(pokemonData) {
  let cardHtml = `<div id="card-${cardIndex}" class="card" onclick="createPopup(${cardIndex})">
        <div class="imageContainer"><img id="pokemonImg${cardIndex}" class="card-img-top img-fluid rounded-start" alt="Pokemon">
        </div>
        <div class="card-body">
            <div class="pokedex-number-container">
                <p class="number" id="pokedexNumberSymbol">#</p>
                <p class="number" id="pokedexNumber${cardIndex}">Nr.</p>
            </div>
            <h5 class="card-title" id="pokemonName${cardIndex}">Name</h5>
            <p class="card-text" id="pokemonType${cardIndex}">Typ</p>
        </div>
    </div>`;

  document.getElementById("card").innerHTML += cardHtml;
  renderPokemonInfo(pokemonData, cardIndex);
}

function renderPokemonInfo(currentPokemon, index) {
  document.getElementById(`pokedexNumber${index}`).innerHTML =
    currentPokemon["game_indices"][4]["game_index"];
  let name = currentPokemon["name"];
  let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  document.getElementById(`pokemonName${index}`).innerHTML = formattedName;
  document.getElementById(`pokemonImg${index}`).src =
    currentPokemon["sprites"]["other"]["official-artwork"]["front_default"];
  let type = currentPokemon["types"][0]["type"]["name"];
  let formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  document.getElementById(`pokemonType${index}`).innerHTML = formattedType;

  let cardElement = document.getElementById(`card-${index}`);
  cardElement.classList.add(type);
}

//Popup
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatWeight(weight) {
  let kgWeight = weight / 10;
  return kgWeight.toLocaleString("de-DE", { minimumFractionDigits: 1 }) + " kg";
}

function formatHeight(height) {
  let mHeight = height / 10;
  return mHeight.toLocaleString("de-DE", { minimumFractionDigits: 1 }) + " m";
}

function formatAbilities(abilities) {
  return abilities
    .map((ability) => capitalizeFirstLetter(ability.ability.name))
    .join(", ");
}

function formatStats(stats) {
  return stats
    .map(
      (stat) => `${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}`
    )
    .join(", ");
}

function createPopup(index) {
  let pokemonData = pokemonDataArray[index - 1];

  if (
    pokemonData &&
    pokemonData.types &&
    pokemonData.types[0] &&
    pokemonData.types[0].type &&
    pokemonData.sprites &&
    pokemonData.sprites.other &&
    pokemonData.sprites.other["official-artwork"] &&
    pokemonData.sprites.other["official-artwork"].front_default &&
    pokemonData.abilities
  ) {
    let name = capitalizeFirstLetter(pokemonData.name);
    let formattedAbilities = formatAbilities(pokemonData.abilities);
    let formattedStats = formatStats(pokemonData.stats);
    let formattedWeight = formatWeight(pokemonData.weight);
    let formattedHeight = formatHeight(pokemonData.height);

    let popupHtml = `<div class="popup ${pokemonData.types[0].type.name}">
        <div class="popup-content">
            <span class="close" onclick="closePopup()">&times;</span>
            <div class="pokemon-details">
                <h2>${name}</h2>
                <img src="${pokemonData.sprites.other["official-artwork"].front_default}" alt="${pokemonData.name}">
                <p><b>Gewicht:</b> ${formattedWeight}</p>
                <p><b>Größe:</b> ${formattedHeight}</p>
                <p><b>Abilities:</b> ${formattedAbilities}</p>
                <p><b>Stats:</b></p>
                <ul>${formattedStats}</ul>
            </div>
            <div class="navigation">
                <span class="arrow left" onclick="loadPreviousPokemon(${index})">❮</span>
                <span class="arrow right" onclick="loadNextPokemon(${index})">❯</span>
            </div>
        </div>
    </div>`;

    document.getElementById("popup").innerHTML = popupHtml;
    document.getElementById("popup").style.display = "block";
  } else {
    console.error("Invalid pokemon data:", pokemonData);
  }
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function loadPreviousPokemon(index) {
  if (index > 1) {
    createPopup(index - 1);
  }
}

function loadNextPokemon(index) {
  if (index < pokemonDataArray.length) {
    createPopup(index + 1);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadPokemon();
});
