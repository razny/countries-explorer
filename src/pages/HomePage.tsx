import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllCountries, type Country } from "../services/api";
import CountryCard from "../components/CountryCard";
import SearchFilters from "../components/SearchFilters";

export default function HomePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Read initial values from URL parameters
  const search = searchParams.get("search") || "";
  const regions = searchParams.get("regions")?.split(",").filter(Boolean) || [];
  const sort = searchParams.get("sort") || "name-asc";

  useEffect(() => {
    getAllCountries()
      .then((data) => {
        setCountries(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const updateSearchParams = (key: string, value: string | string[]) => {
    const newParams = new URLSearchParams(searchParams);

    if (Array.isArray(value)) {
      if (value.length > 0) {
        newParams.set(key, value.join(","));
      } else {
        newParams.delete(key);
      }
    } else if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams, { replace: true });
  };

  const filteredCountries = countries
    .filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRegion =
        regions.length === 0 || regions.includes(country.region);
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.common.localeCompare(b.name.common);
        case "name-desc":
          return b.name.common.localeCompare(a.name.common);
        case "population-desc":
          return b.population - a.population;
        case "population-asc":
          return a.population - b.population;
        default:
          return 0;
      }
    });

  return (
    <>
      <SearchFilters
        search={search}
        regions={regions}
        sort={sort}
        onSearchChange={(value) => updateSearchParams("search", value)}
        onRegionsChange={(value) => updateSearchParams("regions", value)}
        onSortChange={(value) => updateSearchParams("sort", value)}
      />
      <main>
        <div className="container">
          {!isLoading && (
            <div className="results-count">
              Showing {filteredCountries.length} of {countries.length} countries
              {regions.length > 0 && (
                <span className="active-filters">
                  {" "}
                  • Filtered by: {regions.join(", ")}
                </span>
              )}
            </div>
          )}
          <section id="countries-grid">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : filteredCountries.length === 0 ? (
              <p>No countries found</p>
            ) : (
              filteredCountries.map((country) => (
                <CountryCard
                  key={country.cca3}
                  country={country}
                  onClick={(code) => navigate(`/country/${code}`)}
                />
              ))
            )}
          </section>
        </div>
      </main>
    </>
  );
}
