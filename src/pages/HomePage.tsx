import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCountries, type Country } from "../services/api";
import CountryCard from "../components/CountryCard";
import SearchFilters from "../components/SearchFilters";

export default function HomePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCountries()
      .then((data) => {
        setCountries(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRegion =
      region === "all" || country.region.toLowerCase() === region;
    return matchesSearch && matchesRegion;
  });

  return (
    <>
      <SearchFilters
        search={search}
        region={region}
        onSearchChange={setSearch}
        onRegionChange={setRegion}
      />
      <main>
        <div className="container">
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
