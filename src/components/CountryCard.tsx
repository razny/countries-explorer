import type { Country } from "../services/api";

interface CountryCardProps {
  country: Country;
  onClick: (code: string) => void;
}

export default function CountryCard({ country, onClick }: CountryCardProps) {
  return (
    <div className="country-card" onClick={() => onClick(country.cca3)}>
      <div className="flag">
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      </div>
      <div className="card-details">
        <h3>{country.name.common}</h3>
        <p>
          <b>Population:</b> {country.population.toLocaleString()}
        </p>
        <p>
          <b>Region:</b> {country.region}
        </p>
        <p>
          <b>Capital:</b> {country.capital?.[0] ?? "N/A"}
        </p>
      </div>
    </div>
  );
}
