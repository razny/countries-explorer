interface SearchFiltersProps {
  search: string;
  regions: string[];
  sort: string;
  onSearchChange: (value: string) => void;
  onRegionsChange: (values: string[]) => void;
  onSortChange: (value: string) => void;
}

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function SearchFilters({
  search,
  regions,
  sort,
  onSearchChange,
  onRegionsChange,
  onSortChange,
}: SearchFiltersProps) {
  const toggleRegion = (region: string) => {
    if (regions.includes(region)) {
      onRegionsChange(regions.filter((r) => r !== region));
    } else {
      onRegionsChange([...regions, region]);
    }
  };

  return (
    <div className="container">
      <section id="controls">
        <div className="controls-top">
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

          <div className="filters-group">
            <div className="filter-wrapper">
              <label htmlFor="sort">Sort By</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="population-desc">Population (High-Low)</option>
                <option value="population-asc">Population (Low-High)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="region-filters">
          <span className="region-label">Filter by Region:</span>
          <div className="region-checkboxes">
            {REGIONS.map((region) => (
              <label key={region} className="region-checkbox">
                <input
                  type="checkbox"
                  checked={regions.includes(region)}
                  onChange={() => toggleRegion(region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
