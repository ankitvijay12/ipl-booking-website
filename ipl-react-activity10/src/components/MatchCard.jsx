function MatchCard({ match, isSelected, onSelectMatch }) {
  return (
    <article className={`match-card ${isSelected ? "selected" : ""}`}>
      <div className="teams-row">
        <span className="team-pill">{match.team_a}</span>
        <span className="vs-text">vs</span>
        <span className="team-pill">{match.team_b}</span>
      </div>

      <h3>{match.fixture}</h3>
      <p className="detail">{match.venue}</p>
      <p className="detail">
        {match.match_date} • {match.match_time}
      </p>
      <p className="detail">
        Available Seats: <strong>{match.available_seats}</strong>
      </p>
      <p className="price">
        From ₹{Number(match.starting_price).toLocaleString("en-IN")}
      </p>

      <button
        type="button"
        className="secondary-btn"
        onClick={() => onSelectMatch(match)}
      >
        {isSelected ? "Selected" : "Select Match"}
      </button>
    </article>
  );
}

export default MatchCard;
