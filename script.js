let currentPokemon;
let currentBatch = 1; // Variable, um den aktuellen Batch von Pokémon zu verfolgen

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

async function loadPokemon() {
    let startIndex = (currentBatch - 1) * 40 + 1;
    let endIndex = currentBatch * 40;
    let pokemonNames = await fetchPokemonNames(startIndex, endIndex);
    for (let i = 0; i < pokemonNames.length; i++) {
        let pokemonName = pokemonNames[i];
        let pokemonData = await fetchPokemonData(pokemonName);
        renderPokemonInfo(pokemonData);
    }
}

async function fetchPokemonData(pokemonName) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

document.getElementById("loadMoreButton").addEventListener("click", async function() {
    currentBatch++;
    await loadPokemon();
});


function renderPokemonInfo(currentPokemon) {
    document.getElementById('pokedexNumber').innerHTML = currentPokemon['game_indices'][4]['game_index'];
    let name = currentPokemon['name'];
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById('pokemonName').innerHTML = formattedName;
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let type = currentPokemon['types'][0]['type']['name'];
    let formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById('pokemonType').innerHTML = formattedType;
}

window.onload = loadPokemon;

