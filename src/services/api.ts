export interface Country {
  name: {
    common: string;
  };
  population: number;
  region: string;
  capital?: string[];
  flags: {
    png: string;
  };
  cca3: string;
}

export interface CountryDetail extends Country {
  borders?: string[];
  borderNames?: string[];
}

// cache for countries data
let countriesCache: Country[] | null = null;
const countryDetailsCache = new Map<string, CountryDetail>();

export async function getAllCountries(): Promise<Country[]> {
  // return cached data if available
  if (countriesCache) {
    return countriesCache;
  }

  const url =
    "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cca3";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();
  countriesCache = data; // cache the result
  return data;
}

export async function getCountryByCode(code: string): Promise<CountryDetail> {
  code = code.trim().toUpperCase();

  // return cached data if available
  if (countryDetailsCache.has(code)) {
    return countryDetailsCache.get(code)!;
  }

  const url = `https://restcountries.com/v3.1/alpha/${code}?fields=name,population,region,capital,flags,borders,cca3`;
  const response = await fetch(url);

  if (response.status === 404) throw new Error("Invalid country code");
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const country = await response.json();
  let borderNames: string[] = [];

  if (country.borders?.length) {
    const bordersUrl = `https://restcountries.com/v3.1/alpha?codes=${country.borders.join(",")}&fields=cca3`;
    try {
      const bordersResponse = await fetch(bordersUrl);
      if (bordersResponse.ok) {
        const bordersData = await bordersResponse.json();
        borderNames = bordersData.map((b: { cca3: string }) => b.cca3);
      }
    } catch (err) {
      console.warn("Error fetching borders:", err);
    }
  }

  country.borderNames = borderNames;

  // cache the result
  countryDetailsCache.set(code, country);

  return country;
}
