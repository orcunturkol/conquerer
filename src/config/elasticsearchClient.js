const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  // Use HTTPS for the connection
  node: "https://192.168.1.84:9200",
  auth: {
    username: 'elastic',
    password: 'ex-MA-CB7GK+muHsZsz3'
  },
  tls: {
    rejectUnauthorized: false // Only use this in development environments
  }
});

// // Example function to check connection and perform a search
// async function checkElasticsearch() {
//   try {
//     const info = await client.info();
//     console.log("Elasticsearch cluster info:", info);
    
//     // Example search
//     const searchResult = await client.search({
//       index: "search-blogposts",
//       // Example query
//       body: {
//         query: {
//           match: {
//             "profile.username": "Hutchinson",
//           }
//         }
//       },
//     });
//     console.log("Search results:", searchResult.body.hits.hits);
//   } catch (error) {
//     console.error("Error connecting to Elasticsearch:", error);
//   }
// }

// // Uncomment to test your Elasticsearch connection and search functionality
// checkElasticsearch();

module.exports = client;
