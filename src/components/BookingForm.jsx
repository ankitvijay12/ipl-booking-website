import { useState } from "react";

export function BookingForm({ match, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [tickets, setTickets] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      matchId: match.id,
      matchName: `${match.team1} vs ${match.team2}`,
      name,
      tickets: Number(tickets),
      totalPrice: tickets * match.price,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>
          Book Tickets: {match.team1} vs {match.team2}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>
            Your Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Number of Tickets (Max {match.availableSeats}):
            <input
              type="number"
              min="1"
              max={match.availableSeats}
              value={tickets}
              onChange={(e) => setTickets(e.target.value)}
              required
            />
          </label>
          <p>Total: ₹{tickets * match.price}</p>
          <div className="modal-actions">
            <button type="submit">Confirm Booking</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
