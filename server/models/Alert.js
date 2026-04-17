const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userEmail:   { type: String, required: true },
  region:      { type: String, required: true },
  countryCode: { type: String, required: true },
  threshold:   { type: Number, default: 7 },
  isActive:    { type: Boolean, default: true },
  lastAlerted: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);