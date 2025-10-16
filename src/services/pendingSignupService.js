// In-memory store for pending signups (for demo; use Redis or DB for production)
const pendingSignups = {};

function savePendingSignup(email, data) {
  pendingSignups[email] = { ...data, createdAt: Date.now() };
}

function getPendingSignup(email) {
  return pendingSignups[email];
}

function removePendingSignup(email) {
  delete pendingSignups[email];
}

module.exports = { savePendingSignup, getPendingSignup, removePendingSignup };
