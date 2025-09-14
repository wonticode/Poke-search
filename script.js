async function fetchData() {
  try {
    const pokemonName = document
      .getElementById("pokemonName")
      .value.toLowerCase();

    if (!pokemonName || pokemonName === "undefined") {
      throw new Error("Please type a valid pokemon ID or Name.");
    }

    document.getElementById("loading").classList.add("show");

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();

    setTimeout(() => {
      displayPokemon(data);
    }, 800);
  } catch (error) {
    setTimeout(() => {
      console.error(error);
      document.getElementById("loading").classList.remove("show");
      document.getElementById("pokemonDisplay").classList.remove("show");
      document.getElementById("errorMessage").classList.add("show");
    }, 800);
  }
}

function displayPokemon(data) {
  document.getElementById("errorMessage").classList.remove("show");
  document.getElementById("loading").classList.remove("show");

  document.querySelector(".pokemon-image img").src = data.sprites.front_default;
  document.querySelector("#pokemonNameDisplay h2").textContent = data.name;
  document.querySelector("#pokemonId h4").textContent = `#${data.id}`;
  document.querySelector("#pokemonHeight h4").textContent = `${
    data.height / 10
  }m`;
  document.querySelector("#pokemonWeight h4").textContent = `${
    data.weight / 10
  }kg`;

  const typesDiv = document.getElementById("pokemonTypes");
  typesDiv.innerHTML = "";
  data.types.forEach((typeEntry) => {
    const typeName = typeEntry.type.name;
    const typeElement = document.createElement("h3");
    typeElement.textContent = typeName;
    typeElement.classList.add(`type-${typeName}`);
    typesDiv.appendChild(typeElement);
  });

  const pokemonDisplay = document.getElementById("pokemonDisplay");
  pokemonDisplay.classList.remove("show");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pokemonDisplay.classList.add("show");
    });
  });
}

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
