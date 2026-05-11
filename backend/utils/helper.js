function generateTransactionId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `TXN-${timestamp}-${randomStr}`;
}

module.exports = { generateTransactionId };
