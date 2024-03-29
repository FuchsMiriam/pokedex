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
        <div class = "imageContainer"><img id="pokemonImg${cardIndex}" class="card-img-top img-fluid rounded-start" alt="Pokemon">
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

    document.getElementById('card').innerHTML += cardHtml;

    renderPokemonInfo(pokemonData, cardIndex);

    cardIndex++;
}

function renderPokemonInfo(currentPokemon, index) {
    document.getElementById(`pokedexNumber${index}`).innerHTML = currentPokemon['game_indices'][4]['game_index'];
    let name = currentPokemon['name'];
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById(`pokemonName${index}`).innerHTML = formattedName;
    document.getElementById(`pokemonImg${index}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let type = currentPokemon['types'][0]['type']['name'];
    let formattedType = type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById(`pokemonType${index}`).innerHTML = formattedType;

    let cardElement = document.getElementById(`card-${index}`);
    cardElement.classList.add(type);
}

document.addEventListener("DOMContentLoaded", function () {
    loadPokemon();
});

//*Popup*/

function createPopup(pokemonData) {
    let popupHtml = `
    <div class = "overlayOutside">
    <div id="overlay-${cardIndex}" class="overlayVisible">
    <div class="imageContainer"><img id="pokemonImg${cardIndex}"
            class="card-img-top img-fluid rounded-start" alt="Pokemon">
    </div>
    <ul class="nav nav-tabs">
        <div>
            <li class="nav-item">
                <a class="nav-link" aria-current="page" href="#">About</a>
            <li class="list-group-item cardDescription"><b>Größe:</b> <span id="pokemonHeight${cardIndex}">Größe</span>
            </li>
            <li class="list-group-item cardDescription"><b>Gewicht:</b> <span
                    id="pokemonWeight${cardIndex}">Gewicht</span></li>
            <li class="list-group-item cardDescription"><b>Attacken:</b> <span
                    id="pokemonAbility${cardIndex}">Attacken</span></li>
            </li>
        </div>
        <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#">Stats</a>
            <p id="pokedexStats${cardIndex}">Stats</p>
        </li>
        <li class="nav-item">
            <a class="nav-link" aria-current="page" href="#">Evolutions</a>
        </li>
    </ul>
    </div>
    </div>`;

    document.getElementById('overlay').innerHTML = popupHtml;
    document.getElementById('overlay').classList.remove("overlay");
    document.getElementById(`overlay-${cardIndex}`).classList.add("overlayVisible");

    renderPokemonTabs(pokemonData, cardIndex);
    cardIndex++;
}

function renderPokemonTabs(currentPokemon, index) {
    document.getElementById(`pokemonImg${index}`).src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById(`pokedexStats${index}`).innerHTML = currentPokemon['game_indices'][4]['game_index'];
    document.getElementById(`pokemonHeight-${index}`).innerHTML = (currentPokemon['height'] / 10).toLocaleString() + " m";
    document.getElementById(`pokemonWeight${index}`).innerHTML = (currentPokemon['weight'] / 10).toLocaleString() + " kg";
    let abilities = currentPokemon['abilities'].map(function (ability) {
        let abilityName = ability['ability']['name'];
        return abilityName.charAt(0).toUpperCase() + abilityName.slice(1);
    });
    let abilitiesText = abilities.join(', ');
    document.getElementById(`pokemonAbility${index}`).innerHTML = abilitiesText;

};


