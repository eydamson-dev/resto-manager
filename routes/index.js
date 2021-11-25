const express = require('express');

const Restaurant = require('../models/Restaurant');
const routes = express.Router();

routes.route('/').get((req, res) => {
  let { days, time } = req.body;
  Restaurant.getRestaurant(days, time)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

routes.route('/seed').get(async (_, res) => {
  Restaurant.seed()
    .then((data) => {
      res.status(200).json(data);
    })
    .then((error) => {
      res.status(500).json(error);
    });
});

module.exports = routes;

