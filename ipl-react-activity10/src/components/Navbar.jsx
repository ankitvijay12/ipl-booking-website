function Navbar({ selectedTeam, onSelectTeam, totalMatches }) {
  const teams = [
    "ALL",
    "csk",
    "MI",
    "RCB",
    "KKR",
    "GT",
    "RR",
    "SRH",
    "DC",
    "LSG",
    "PBKS",
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <a href="#top" className="logo">
          IPL 2026
        </a>

        <nav className="nav-links">
          <a href="#matches">Matches ({totalMatches})</a>
          <a href="#selected">Selected Match</a>
        </nav>

        <div className="filter-box">
          <label htmlFor="team-select">Filter Team: </label>
          <select
            id="team-select"
            value={selectedTeam}
            onChange={(e) => onSelectTeam(e.target.value)}
          >
            {teams.map((team) => (
              <option key={team} value={team}>
                {team === "ALL" ? "All Teams" : team}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
