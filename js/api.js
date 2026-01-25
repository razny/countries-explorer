async function getAllCountries() {
  const url =
    "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cca3"; // Added cca3

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return response.json();
}

// getCountryByCode(code)
async function getCountryByCode(code) {
  code = code.trim().toUpperCase();

  const url = `https://restcountries.com/v3.1/alpha/${code}?fields=name,population,region,capital,flags,borders`;
  const response = await fetch(url);

  if (response.status === 404) throw new Error("Invalid country code");
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const country = await response.json();
  let borderNames = [];
  if (country.borders?.length) {
    const bordersUrl = `https://restcountries.com/v3.1/alpha?codes=${country.borders.join(",")}&fields=cca3`;
    try {
      const bordersResponse = await fetch(bordersUrl);
      if (bordersResponse.ok) {
        const bordersData = await bordersResponse.json();
        borderNames = bordersData.map((b) => b.cca3);
      } else {
        console.warn(
          "Failed to fetch border countries:",
          bordersResponse.status,
        );
      }
    } catch (err) {
      console.warn("Error fetching borders:", err);
    }
  }

  country.borderNames = borderNames;

  return country;
}
