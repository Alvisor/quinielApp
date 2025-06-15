const express = require('express');
const bodyParser = require('body-parser');
const torneoRoutes = require('./src/routes/torneoRoutes');

const app = express();
app.use(bodyParser.json());

app.use('/torneos', torneoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
