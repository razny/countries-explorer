let allCountries = [];
const container = document.querySelector("#countries-grid");

// load all countries
async function loadAllCountries() {
  allCountries = await getAllCountries();
  renderCountries(allCountries);
}

// render country cards
function renderCountries(countriesArray) {
  container.innerHTML = "";

  if (!countriesArray.length) {
    container.innerHTML = "<p>No countries found</p>";
    return;
  }

  countriesArray.forEach((country) => {
    const card = document.createElement("div");
    card.classList.add("country-card");
    card.dataset.code = country.cca3 || country.code;

    card.innerHTML = `
      <div class="flag">
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      </div>
      <div class="card-details">
        <h3>${country.name.common}</h3>
        <p><b>Population:</b> ${country.population.toLocaleString()}</p>
        <p><b>Region:</b> ${country.region}</p>
        <p><b>Capital:</b> ${country.capital?.[0] ?? "N/A"}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// search and region filtering
function setupFilters() {}

// navigate to detail page on card click
function setupCardClicks() {
  container.addEventListener("click", (e) => {
    const card = e.target.closest(".country-card");
    if (!card) return;

    const code = card.dataset.code;
    if (code) {
      window.location.href = `country.html?code=${code}`; // to country page
    }
  });
}

// initialize page
function init() {
  loadAllCountries();
  setupFilters();
  setupCardClicks();
}

init();
