// --- Activity 7: Live Booking Summary (for booking.html) ---
const matchSelect = document.getElementById("match-select");
const standSelect = document.querySelector("#stand-select");
const qtyInput = document.querySelector("#ticket-qty");

const summaryMatch = document.getElementById("summary-match");
const summaryStand = document.getElementById("summary-stand");
const summaryQty = document.getElementById("summary-qty");
const summaryTotal = document.getElementById("summary-total");
const toastEl = document.querySelector("#toast");

let toastTimer = null;

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2200);
}

function parseStand(value) {
  const [stand, price] = value.split("|");
  return { stand, price: Number(price) || 0 };
}

function getQuantity() {
  let qty = parseInt(qtyInput.value, 10);
  if (Number.isNaN(qty) || qty < 1) {
    qty = 1;
    qtyInput.value = 1;
  } else if (qty > 10) {
    qty = 10;
    qtyInput.value = 10;
  }
  return qty;
}

function updateSummary(notify = true) {
  if (!matchSelect || !standSelect || !qtyInput) return;

  const match = matchSelect.value;
  const { stand, price } = parseStand(standSelect.value);
  const qty = getQuantity();
  const total = price * qty;

  if (summaryMatch) summaryMatch.textContent = match;
  if (summaryStand) summaryStand.textContent = stand;
  if (summaryQty) summaryQty.textContent = qty;
  if (summaryTotal)
    summaryTotal.textContent = `₹${total.toLocaleString("en-IN")}`;

  if (notify) {
    showToast(
      `Summary updated: ${qty} × ${stand} (${match}) — ₹${total.toLocaleString("en-IN")}`,
    );
  }
}

if (matchSelect && standSelect && qtyInput) {
  matchSelect.addEventListener("change", () => updateSummary(true));
  standSelect.addEventListener("change", () => updateSummary(true));
  qtyInput.addEventListener("change", () => updateSummary(true));
  updateSummary(false);
}

// --- Activity 8: Team Filter, Grid/List View Toggle & Mobile Menu ---
const teamFilter = document.getElementById("team-filter");
const viewToggleBtn = document.getElementById("view-toggle-btn");
const matchesGrid = document.getElementById("matches-grid");
const matchCards = document.querySelectorAll(".match-card");

const hamburgerBtn = document.getElementById("hamburger-btn");
const mainNav = document.getElementById("main-nav");

if (teamFilter && matchCards.length > 0) {
  teamFilter.addEventListener("change", () => {
    const selectedTeam = teamFilter.value;

    matchCards.forEach((card) => {
      const teams = (card.dataset.teams || "").split(" ");
      const shouldShow = selectedTeam === "ALL" || teams.includes(selectedTeam);
      card.style.display = shouldShow ? "" : "none";
    });

    showToast(
      selectedTeam === "ALL"
        ? "Showing all scheduled matches"
        : `Filtered matches for ${selectedTeam}`,
    );
  });
}

if (viewToggleBtn && matchesGrid) {
  viewToggleBtn.addEventListener("click", () => {
    const isListView = matchesGrid.classList.toggle("list-view");
    viewToggleBtn.textContent = isListView
      ? "Switch to Grid View"
      : "Switch to List View";
    showToast(isListView ? "Switched to List View" : "Switched to Grid View");
  });
}

if (hamburgerBtn && mainNav) {
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });
}
