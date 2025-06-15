const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const groupsRoutes = require('./routes/groups');
const scrapeRoutes = require('./routes/scrape');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', authRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/scrape', scrapeRoutes);

app.get('/', (req, res) => {
  res.send('quinielApp API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
