import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllCountries,
  getCountryByCode,
  type Country,
  type CountryDetail,
} from "../services/api";

export default function ComparisonPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>(
    searchParams.get("countries")?.split(",").filter(Boolean) || [],
  );
  const [comparisonData, setComparisonData] = useState<CountryDetail[]>([]);
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

  useEffect(() => {
    // Only fetch comparison data if at least 2 countries are selected
    if (selectedCodes.length < 2) {
      return;
    }

    Promise.all(selectedCodes.map((code) => getCountryByCode(code)))
      .then((data) => setComparisonData(data))
      .catch((err) => console.error("Error loading comparison data:", err));
  }, [selectedCodes]);

  const toggleCountry = (code: string) => {
    let newCodes: string[];
    if (selectedCodes.includes(code)) {
      newCodes = selectedCodes.filter((c) => c !== code);
    } else {
      if (selectedCodes.length >= 4) {
        alert("You can compare up to 4 countries at a time");
        return;
      }
      newCodes = [...selectedCodes, code];
    }
    setSelectedCodes(newCodes);

    const newParams = new URLSearchParams();
    if (newCodes.length > 0) {
      newParams.set("countries", newCodes.join(","));
    }
    setSearchParams(newParams, { replace: true });
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <main>
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="comparison-header">
          <h2>Country Comparison</h2>
          <p className="comparison-subtitle">
            Select at least 2 countries (up to 4) to compare side-by-side
          </p>
        </div>

        <div className="country-selector">
          <div className="selector-header">
            <h3>
              Select Countries{" "}
              {selectedCodes.length > 0 && `(${selectedCodes.length} selected)`}
            </h3>
            <div className="selector-search">
              <svg
                className="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="selector-search-input"
              />
            </div>
          </div>
          <div className="selector-grid">
            {filteredCountries.map((country) => (
              <label key={country.cca3} className="selector-item">
                <input
                  type="checkbox"
                  checked={selectedCodes.includes(country.cca3)}
                  onChange={() => toggleCountry(country.cca3)}
                  disabled={
                    !selectedCodes.includes(country.cca3) &&
                    selectedCodes.length >= 4
                  }
                />
                <img src={country.flags.png} alt={country.name.common} />
                <span>{country.name.common}</span>
              </label>
            ))}
          </div>
        </div>

        {comparisonData.length >= 2 && (
          <div className="comparison-grid">
            {comparisonData.map((country, index) => (
              <div
                key={country.cca3}
                className="comparison-card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}>
                <div className="comparison-flag">
                  <img src={country.flags.png} alt={country.name.common} />
                </div>
                <h3>{country.name.common}</h3>

                <div className="comparison-stats">
                  <div className="stat-item">
                    <strong>Population</strong>
                    <span>{country.population.toLocaleString()}</span>
                  </div>

                  <div className="stat-item">
                    <strong>Region</strong>
                    <span>{country.region}</span>
                  </div>

                  <div className="stat-item">
                    <strong>Capital</strong>
                    <span>{country.capital?.[0] || "N/A"}</span>
                  </div>

                  <div className="stat-item">
                    <strong>Borders</strong>
                    <span>{country.borders?.length || 0} countries</span>
                  </div>
                </div>

                <button
                  className="view-details-btn"
                  onClick={() => navigate(`/country/${country.cca3}`)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedCodes.length === 0 && (
          <div className="comparison-empty">
            <p>Select countries above to start comparing</p>
          </div>
        )}

        {selectedCodes.length === 1 && (
          <div className="comparison-empty">
            <p>Select at least one more country to compare...</p>
          </div>
        )}
      </div>
    </main>
  );
}
