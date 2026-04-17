const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  countryCode: { type: String, required: true, unique: true },
  latitude:    { type: Number, required: true },
  longitude:   { type: Number, required: true },
  riskScore:   { type: Number, default: 0 },   // 0-100
  riskLevel:   { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Region', regionSchema);