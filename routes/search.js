const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the search function
async function searchListings(query) {
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
    }
  ];

  const results = await collection.aggregate(pipeline).toArray();
  return results;
}

// Define the search route
router.get('/search', async (req, res, next) => {
  const query = req.query.q || '';
  try {
    const results = await searchListings(query);
    res.render('search/searchResults', { query, results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
