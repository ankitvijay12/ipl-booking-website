import { useState } from "react";
import { Navbar } from "./components/Navbar.jsx";
import { MatchCard } from "./components/MatchCard.jsx";
import { BookingForm } from "./components/BookingForm.jsx";
import { Footer } from "./components/Footer.jsx";
import "./App.css";

const MATCHES = [
  {
    id: 1,
    team1: "CSK",
    team2: "MI",
    date: "April 14",
    venue: "Mumbai",
    price: 1500,
    availableSeats: 45,
  },
  {
    id: 2,
    team1: "RCB",
    team2: "KKR",
    date: "April 16",
    venue: "Bengaluru",
    price: 1800,
    availableSeats: 30,
  },
  {
    id: 3,
    team1: "GT",
    team2: "RR",
    date: "April 18",
    venue: "Ahmedabad",
    price: 1200,
    availableSeats: 50,
  },
  {
    id: 4,
    team1: "SRH",
    team2: "DC",
    date: "April 20",
    venue: "Hyderabad",
    price: 1000,
    availableSeats: 40,
  },
  {
    id: 5,
    team1: "LSG",
    team2: "PBKS",
    date: "April 22",
    venue: "Lucknow",
    price: 1100,
    availableSeats: 35,
  },
];

export default function App() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [bookings, setBookings] = useState([]);

  const handleBooking = (booking) => {
    // 1. Subtract booked seats
    selectedMatch.availableSeats -= booking.tickets;

    // 2. Add new booking to list
    setBookings(bookings.concat(booking));

    // 3. Close the popup
    setSelectedMatch(null);
  };

  return (
    <div className="app">
      <Navbar totalBookings={bookings.length} />

      <main className="container">
        <h1>IPL Matches</h1>
        <div className="match-grid">
          {MATCHES.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onSelectMatch={(m) => setSelectedMatch(m)}
            />
          ))}
        </div>
      </main>

      {selectedMatch && (
        <BookingForm
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSubmit={handleBooking}
        />
      )}

      <Footer />
    </div>
  );
}
