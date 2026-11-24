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
