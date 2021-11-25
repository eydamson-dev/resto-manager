require('dotenv').config( { path: './.env' } );

const express = require('express');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

const dbo = require('./db/conn');
const app = express();

app.use(express.json());
app.use(routes);
dbo.connectToServer((err) => {
  if (err) {
    console.log({'connection-error': err});
    process.exit();
  }

  app.listen(PORT, () => {
    // console.log(`listening at http://localhost:${PORT}`);
  });
});

module.exports = app;

