const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the autocomplete function
async function searchAutoComplete(query) {
  const db = mongoose.connection.db;
  const collection = db.collection('listings');

  const pipeline = [
    {
      $search: {
        index: 'searchListing',
        text: {
          query: query,
          path: {
            wildcard: '*'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        title: 1
      }
    }
  ];

  const results = await collection.aggregate(pipeline).toArray();
  return results;
}

// Define the autocomplete route
router.get('/autocomplete', async (req, res, next) => {
  const query = req.query.q || '';
  try {
    const results = await searchAutoComplete(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
