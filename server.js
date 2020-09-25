require('dotenv').config();

const app = require('./app');

const port = process.env.PORT || 8000;

/* eslint-disable no-console */
app.listen(port, () => console.log(`Listening on ${port}`));
