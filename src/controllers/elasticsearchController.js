const elasticsearchClient = require("../config/elasticsearchClient");
const logger = require("../utils/winstonLogger");

const getCategoryRates = async (req, res) => {
  try {
    const result = await elasticsearchClient.search({
      index: "blogposts",
      size: 0,
      aggs: {
        category_counts: {
          terms: {
            field: "category",
          },
        },
      },
    });

    if (!result.aggregations || !result.aggregations.category_counts) {
      return res.status(404).json({
        success: false,
        message: "No category data found",
      });
    }

    const total = result.aggregations.category_counts.buckets.reduce(
      (sum, bucket) => sum + bucket.doc_count,
      0
    );

    const percentages = result.aggregations.category_counts.buckets.map(
      (bucket) => ({
        category: bucket.key,
        percentage: ((bucket.doc_count / total) * 100).toFixed(2),
      })
    );

    res.json({ success: true, data: percentages });
  } catch (error) {
    logger.error("Elasticsearch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching category rates",
      error: error.message,
    });
  }
};

const getUserStats = async (req, res) => {
  try {
    // 1. Calculate total number of users
    const usersCountResult = await elasticsearchClient.count({
      index: "users",
    });

    const totalUsers = usersCountResult.count;

    // 2. Identify users who have written posts
    const bloggersResult = await elasticsearchClient.search({
      index: "posts",
      size: 0,
      aggs: {
        bloggers: {
          terms: { field: "profile.username" },
        },
      },
    });
    const bloggersCount = bloggersResult.aggregations.bloggers.buckets.length;

    // 3. Calculate readers (users who haven't written posts)
    const readersCount = totalUsers - bloggersCount;

    // Send response
    res.json({
      success: true,
      data: {
        totalUsers,
        bloggersCount,
        readersCount,
      },
    });
  } catch (error) {
    logger.error("Elasticsearch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user stats",
      error: error.message,
    });
  }
};

const getPostsByTime = async (req, res) => {
  try {
    // Extract the full date from the query parameter
    const queryDate = req.query.date;
    if (!queryDate) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // Parse the date and determine the start and end of the week, month, and year
    const date = new Date(queryDate);
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const endOfYear = new Date(date.getFullYear(), 11, 31);

    // Elasticsearch query
    const result = await elasticsearchClient.search({
      index: "posts",
      size: 0,
      query: {
        range: {
          createdAt: {
            gte: startOfYear.toISOString(),
            lte: endOfYear.toISOString(),
          },
        },
      },
      aggs: {
        this_week: {
          filter: {
            range: {
              createdAt: {
                gte: startOfWeek.toISOString(),
                lte: endOfWeek.toISOString(),
              },
            },
          },
          aggs: {
            categories: { terms: { field: "category" } },
          },
        },
        this_month: {
          filter: {
            range: {
              createdAt: {
                gte: startOfMonth.toISOString(),
                lte: endOfMonth.toISOString(),
              },
            },
          },
          aggs: {
            categories: { terms: { field: "category" } },
          },
        },
        this_year: {
          filter: {
            range: {
              createdAt: {
                gte: startOfYear.toISOString(),
                lte: endOfYear.toISOString(),
              },
            },
          },
          aggs: {
            categories: { terms: { field: "category" } },
          },
        },
      },
    });

    // Process and format the response
    const formattedResponse = {
      this_week: result.aggregations.this_week.categories.buckets.reduce(
        (acc, cat) => {
          acc[cat.key] = cat.doc_count;
          return acc;
        },
        {}
      ),
      this_month: result.aggregations.this_month.categories.buckets.reduce(
        (acc, cat) => {
          acc[cat.key] = cat.doc_count;
          return acc;
        },
        {}
      ),
      this_year: result.aggregations.this_year.categories.buckets.reduce(
        (acc, cat) => {
          acc[cat.key] = cat.doc_count;
          return acc;
        },
        {}
      ),
    };

    // Send the response
    res.json({ success: true, data: formattedResponse });
  } catch (error) {
    console.error("Elasticsearch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts by time",
      error: error.message,
    });
  }
};

module.exports = {
  getCategoryRates,
  getUserStats,
  getPostsByTime,
};
