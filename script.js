async function fetchData() {
  try {
    // loading
    document.getElementById("loading").classList.add("show");

    // Pokemon name input
    const pokemonName = document
      .getElementById("pokemonName")
      .value.toLowerCase();

    // Fetching data
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();

    // Display the sprite
    if (pokemonName === "undefined" || pokemonName.length < 1) {
      throw new Error("Please type a valid pokemon ID or Name.");
    } else {
      console.log(data);
      setTimeout(() => {
        displayNameId(data);
        displayHeight(data);
        displayWeight(data);
        displayType(data);
      }, 800);
    }
  } catch (error) {
    setTimeout(() => {
      console.error(error);
      document.getElementById("loading").classList.remove("show");
      document.getElementById("pokemonDisplay").classList.remove("show");
      const errorDisplay = document
        .getElementById("errorMessage")
        .classList.add("show");
    }, 800);
  }
}

function displayNameId(data) {
  document.getElementById("errorMessage").classList.remove("show");
  const pokemonSprite = data.sprites.front_default;
  const imgDisplay = document.querySelector(".pokemon-image img");
  imgDisplay.src = pokemonSprite;
  document.getElementById("pokemonDisplay").classList.add("show");
  document.getElementById("loading").classList.remove("show");
  const pokeNameDisplay = document.querySelector("#pokemonNameDisplay h2");
  const pokeName = data.name;
  pokeNameDisplay.textContent = pokeName;
  const pokemonIdDisplay = document.querySelector("#pokemonId h4");
  const pokemonID = data.id;
  pokemonIdDisplay.textContent = pokemonID;
}

function displayHeight(data) {
  const heightH4 = document.querySelector("#pokemonHeight h4");
  const pokemonHeight = data.height / 10;
  heightH4.textContent = `${pokemonHeight}m`;
}

function displayWeight(data) {
  const weightH4 = document.querySelector("#pokemonWeight h4");
  const pokemonWeight = data.weight / 10;
  weightH4.textContent = `${pokemonWeight}Kg`;
}

function displayType(data) {
  const typesDiv = document.getElementById("pokemonTypes");
  typesDiv.innerHTML = "";

  data.types.forEach((element) => {
    const typeName = element.type.name;
    const typeElement = document.createElement("h3");
    typeElement.textContent = typeName;
    typesDiv.appendChild(typeElement);
    typeElement.classList.add(`type-${typeName}`);
  });
}

// test
let pokemonList = [];

async function loadPokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
  const data = await response.json();
  pokemonList = data.results.map((p) => p.name);
}

function showSuggestions(query) {
  const suggestionsContainer = document.getElementById("suggestions");
  if (!query) {
    suggestionsContainer.classList.remove("show");
    suggestionsContainer.innerHTML = "";
    return;
  }

  const suggestions = pokemonList.filter((name) =>
    name.startsWith(query.toLowerCase())
  );

  if (suggestions.length === 0) {
    suggestionsContainer.classList.remove("show");
    suggestionsContainer.innerHTML = "";
    return;
  }

  suggestionsContainer.innerHTML = "";

  suggestions.forEach((name) => {
    const div = document.createElement("div");
    div.textContent = name;
    div.classList.add("suggestion-item");
    div.onclick = () => {
      document.getElementById("pokemonName").value = name;
      suggestionsContainer.classList.remove("show");
      suggestionsContainer.innerHTML = "";
    };
    suggestionsContainer.appendChild(div);
  });

  suggestionsContainer.classList.add("show");
}

document.getElementById("pokemonName").addEventListener("input", (e) => {
  showSuggestions(e.target.value);
});

loadPokemonList();
