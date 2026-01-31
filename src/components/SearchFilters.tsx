interface SearchFiltersProps {
  search: string;
  region: string;
  onSearchChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}

export default function SearchFilters({
  search,
  region,
  onSearchChange,
  onRegionChange,
}: SearchFiltersProps) {
  return (
    <section id="controls">
      <div className="search-wrapper">
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
          id="search"
          placeholder="Search for a country..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-wrapper">
        <label htmlFor="filters">Filter by Region</label>
        <select
          id="filters"
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}>
          <option value="all">All</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>
    </section>
  );
}
