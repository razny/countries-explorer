import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCountryByCode, type CountryDetail } from "../services/api";

export default function CountryPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (code) {
      getCountryByCode(code)
        .then((data) => {
          setCountry(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [code]);

  if (error) {
    return (
      <main>
        <div className="container">
          <button id="go-back" onClick={() => navigate("/")}>
            ← Back
          </button>
          <p style={{ padding: "2rem 0", fontSize: "1.2rem" }}>
            Error: {error}
          </p>
        </div>
      </main>
    );
  }

  if (isLoading || !country) {
    return (
      <main>
        <div className="container">
          <button id="go-back" onClick={() => navigate("/")}>
            ← Back
          </button>
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
        <button id="go-back" onClick={() => navigate("/")}>
          ← Back
        </button>
        <section id="country-info">
          <div className="flag">
            <img
              src={country.flags.png}
              alt={`Flag of ${country.name.common}`}
            />
          </div>
          <div className="country-details">
            <h2>{country.name.common}</h2>
            <ul className="stats">
              <li>
                <b>Population:</b> {country.population.toLocaleString()}
              </li>
              <li>
                <b>Region:</b> {country.region}
              </li>
              <li>
                <b>Capital:</b> {country.capital?.[0] ?? "N/A"}
              </li>
            </ul>
            <div className="borders">
              <p>Border countries:</p>
              {country.borderNames && country.borderNames.length > 0 ? (
                country.borderNames.map((name) => (
                  <button
                    key={name}
                    className="border-btn"
                    onClick={() => navigate(`/country/${name}`)}>
                    {name}
                  </button>
                ))
              ) : (
                <span>None</span>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
