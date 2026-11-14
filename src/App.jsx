import { useState, useRef } from "react";
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
  const [toastMessage, setToastMessage] = useState(null); // State for toast notification

  // Reference for smooth scrolling to the booking section
  const bookingRef = useRef(null);

  // Helper function to show and auto-hide toast notifications
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // Hide after 3 seconds
  };

  const handleSelectMatch = (m) => {
    setSelectedMatch(m);
    // Smooth scroll down to the booking form section when Book is clicked
    if (bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBooking = (booking) => {
    // 1. Subtract booked seats
    selectedMatch.availableSeats -= booking.tickets;

    // 2. Add new booking to list
    setBookings(bookings.concat(booking));

    // 3. Close the popup and trigger success toast notification
    setSelectedMatch(null);
    showToast("🎉 Booking confirmed successfully!");
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
              onSelectMatch={handleSelectMatch}
            />
          ))}
        </div>
      </main>

      {/* Attach reference here so the page smoothly scrolls to this wrapper */}
      <div ref={bookingRef}>
        {selectedMatch && (
          <BookingForm
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onSubmit={handleBooking}
          />
        )}
      </div>

      {/* Toast Notification Popup */}
      {toastMessage && <div className="toast-notification">{toastMessage}</div>}

      <Footer />
    </div>
  );
}
