let currentPokemon;

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/togepi';
    let response = await fetch(url);
    currentPokemon = await response.json();

    console.log('Loaded pokemon', currentPokemon);

    renderPokemonInfo();
}

function renderPokemonInfo() {
    document.getElementById('pokedexNumber').innerHTML = currentPokemon['game_indices'][0]['game_index'];
    var name = currentPokemon['name'];
    var formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    document.getElementById('pokemonName').innerHTML = formattedName;
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['front_default'];
    document.getElementById('pokemonType').innerHTML = currentPokemon['types'][0]['type']['name'];
    document.getElementById('pokemonHeight').innerHTML = (currentPokemon['height'] / 10).toLocaleString() + " m";
    document.getElementById('pokemonWeight').innerHTML = (currentPokemon['weight'] / 10).toLocaleString() + " kg";

    var abilities = currentPokemon['abilities'].map(function(ability) {
        var abilityName = ability['ability']['name'];
        return abilityName.charAt(0).toUpperCase() + abilityName.slice(1);
    });

    var abilitiesText = abilities.join(', ');

    document.getElementById('pokemonAbility').innerHTML = abilitiesText;
}
