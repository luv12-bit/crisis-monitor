const mongoose = require('mongoose');

const crisisEventSchema = new mongoose.Schema({
  region:      { type: String, required: true },
  countryCode: { type: String, required: true },
  type:        { type: String, enum: ['conflict', 'famine', 'disease', 'disaster', 'economic'], required: true },
  title:       { type: String, required: true },
  description: { type: String },
  severity:    { type: Number, min: 1, max: 10 },
  source:      { type: String },   // GDELT, WHO, ACLED etc
  eventDate:   { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('CrisisEvent', crisisEventSchema);