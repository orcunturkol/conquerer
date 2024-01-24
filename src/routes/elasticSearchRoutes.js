const express = require("express");
const router = express.Router();
const {
  getCategoryRates,
  getUserStats,
  getPostsByTime,
} = require("../controllers/elasticsearchController");

router.get("/category-rates", getCategoryRates);
router.get("/user-stats", getUserStats);
router.get("/posts-by-time", getPostsByTime);
// Export the router
module.exports = router;
