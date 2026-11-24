import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import "./App.css";

export default function App() {
  const [matches, setMatches] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [seatsBooked, setSeatsBooked] = useState(1);

  async function fetchMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const rows = data || [];
    setMatches(rows);
    setErrorMsg("");

    if (rows.length > 0) {
      setSelectedMatch((prev) => {
        if (!prev) return rows[0];
        return rows.find((m) => m.id === prev.id) || rows[0];
      });
    } else {
      setSelectedMatch(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchMatches();

    const channel = supabase
      .channel("ipl-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => {
          fetchMatches();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          fetchMatches();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredMatches =
    selectedTeam === "ALL"
      ? matches
      : matches.filter(
          (item) =>
            item.team_a === selectedTeam || item.team_b === selectedTeam,
        );

  async function handleBookingSubmit(e) {
    e.preventDefault();
    setBookingMsg("");

    if (!selectedMatch) {
      setBookingMsg("Select a match first.");
      return;
    }

    const seats = Number(seatsBooked);
    if (!customerName.trim() || !customerEmail.trim() || seats < 1) {
      setBookingMsg("Enter name, email, and at least 1 seat.");
      return;
    }

    if (seats > selectedMatch.available_seats) {
      setBookingMsg(
        `Only ${selectedMatch.available_seats} seats left for ${selectedMatch.fixture}.`,
      );
      return;
    }

    setSubmitting(true);
    const totalAmount = seats * selectedMatch.starting_price;

    const { error: insertError } = await supabase.from("bookings").insert([
      {
        match_id: selectedMatch.id,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        seats_booked: seats,
        total_amount: totalAmount,
      },
    ]);

    if (insertError) {
      setBookingMsg(`Booking failed: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    const nextSeats = selectedMatch.available_seats - seats;
    const { error: updateError } = await supabase
      .from("matches")
      .update({ available_seats: nextSeats })
      .eq("id", selectedMatch.id);

    if (updateError) {
      setBookingMsg(`Seat update failed: ${updateError.message}`);
      setSubmitting(false);
      return;
    }

    await fetchMatches();
    setBookingMsg(
      `Booked ${seats} seat(s) for ${selectedMatch.fixture} (₹${totalAmount}).`,
    );
    setCustomerName("");
    setCustomerEmail("");
    setSeatsBooked(1);
    setSubmitting(false);
  }

  return (
    <div id="top" className="app-shell">
      <Navbar
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
        totalMatches={filteredMatches.length}
      />

      <main className="container">
        <Hero
          title="IPL 2026 Match Schedule & Booking"
          subtitle="Live matches, seat availability, and bookings synced with Supabase."
        />

        <section id="selected" className="panel">
          <h2>Active Match Selection & Booking</h2>

          {selectedMatch ? (
            <>
              <p>
                <strong>Fixture:</strong> {selectedMatch.fixture} —{" "}
                <strong>Venue:</strong> {selectedMatch.venue} —{" "}
                <strong>Available Seats:</strong>{" "}
                {selectedMatch.available_seats} — <strong>Price:</strong> ₹
                {selectedMatch.starting_price}
              </p>

              <form onSubmit={handleBookingSubmit} className="booking-form">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
                <input
                  type="number"
                  min="1"
                  max={selectedMatch.available_seats || 1}
                  value={seatsBooked}
                  onChange={(e) => setSeatsBooked(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={submitting || selectedMatch.available_seats < 1}
                >
                  {submitting
                    ? "Booking..."
                    : `Book (₹${Number(seatsBooked || 0) * selectedMatch.starting_price})`}
                </button>
              </form>
            </>
          ) : (
            <p>No match selected.</p>
          )}

          {bookingMsg && <p className="booking-status">{bookingMsg}</p>}
        </section>

        <section id="matches" className="panel">
          <h2>Matches ({selectedTeam === "ALL" ? "All" : selectedTeam})</h2>

          {loading && <p>Loading matches from Supabase...</p>}
          {errorMsg && <p>Error: {errorMsg}</p>}

          {!loading && !errorMsg && (
            <div className="match-grid">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isSelected={selectedMatch?.id === match.id}
                  onSelectMatch={setSelectedMatch}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
