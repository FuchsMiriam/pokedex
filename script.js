let currentPokemon;
let currentBatch = 1;
cardIndex = 1;

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

async function fetchPokemonNames(startIndex, endIndex) {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=${endIndex - startIndex + 1}&offset=${startIndex - 1}`;
    let response = await fetch(url);
    let data = await response.json();
    let pokemonNames = data.results.map(pokemon => pokemon.name);
    return pokemonNames;
}

async function fetchPokemonData(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

document.getElementById("loadMoreButton").addEventListener("click", async function () {
    currentBatch++;
    await loadPokemon();
});

async function loadPokemon() {
    let startIndex = (currentBatch - 1) * 40 + 1;
    let endIndex = currentBatch * 40;
    let pokemonNames = await fetchPokemonNames(startIndex, endIndex);

    for (let i = 0; i < pokemonNames.length; i++) {
        let pokemonName = pokemonNames[i];
        let pokemonData = await fetchPokemonData(pokemonName);
        createCard(pokemonData);
    }
}

function createCard(pokemonData) {
    let cardHtml = `<div id="card-${cardIndex}" class = "card">
        <img id="pokemonImg-${cardIndex}" class="card-img-top img-fluid rounded-start" alt="Pokemon">
        <div class="card-body">
            <div class="pokedex-number-container">
                <p id="pokedexNumberSymbol">#</p>
                <p id="pokedexNumber${cardIndex}">Nr.</p>
            </div>
            <h5 class="card-title" id="pokemonName-${cardIndex}">Name</h5>
            <p class="card-text" id="pokemonType-${cardIndex}">Typ</p>
        </div>
    </div>`;

    document.getElementById('card').innerHTML += cardHtml;
    renderPokemonInfo(pokemonData, cardIndex);
    cardIndex++;
}

function renderPokemonInfo(currentPokemon, index) {
    document.getElementById(`pokedexNumber${index}`).innerHTML = currentPokemon['game_indices'][4]['game_index'];
    let name = currentPokemon['name'];
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById(`pokemonName-${index}`).innerHTML = formattedName;
    document.getElementById(`pokemonImg-${index}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let type = currentPokemon['types'][0]['type']['name'];
    let formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById(`pokemonType-${index}`).innerHTML = formattedType;
}

document.addEventListener("DOMContentLoaded", function () {
    loadPokemon();
});


