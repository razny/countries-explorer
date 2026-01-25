const infoSection = document.getElementById("country-info");

// read country code from URL
// fetch country data
async function loadCountryFromURL() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    infoSection.innerHTML = `<p>No code provided.</p>`;
    return;
  }

  try {
    const country = await getCountryByCode(code);
    renderCountryDetails(country);
  } catch (err) {
    console.error(err);
    infoSection.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

// render details
function renderCountryDetails(country) {
  infoSection.innerHTML = `
    <div class="flag">
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
    </div>
    <div class="country-details">
      <h2>${country.name.common}</h2>
      <ul class="stats">
        <li><b>Population:</b> ${country.population.toLocaleString()}</li>
        <li><b>Region:</b> ${country.region}</li>
        <li><b>Capital:</b> ${country.capital?.[0] ?? "N/A"}</li>
      </ul>
      <div class="borders">
        <p>Border countries:</p>
        ${
          country.borderNames.length
            ? country.borderNames
                .map(
                  (name) =>
                    `<button class="border-btn" data-name="${name}">${name}</button>`,
                )
                .join("")
            : "<span>None</span>"
        }
      </div>
    </div>
  `;

  setupBorderClicks();
}

// handle border country clicks
function setupBorderClicks() {}

// go back to home page
function setupBackButton() {
  const backBtn = document.getElementById("go-back");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

// initialize
function init() {
  loadCountryFromURL();
  setupBackButton();
}

init();
