const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const cron         = require('node-cron');
require('dotenv').config();

const authRoutes   = require('./routes/authRoutes');
const crisisRoutes = require('./routes/crisisRoutes');
const fetchLiveNews = require('./services/newsFetcher');
const alertRoutes = require('./routes/alertRoutes');
const app = express();

app.use(cors({ origin: "*",}));
app.use(express.json());

app.use('/api/auth',   authRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Shadow Crisis Monitor API is running!' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await fetchLiveNews(); // fetch immediately on startup
    cron.schedule('0 */6 * * *', fetchLiveNews); // then every 6 hours
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });