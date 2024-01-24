const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: "https://069679a40eab49f899ca5c0acd6eeb48.europe-west3.gcp.cloud.es.io:443",
  auth: {
    apiKey: "MzgtZE80MEJUaTVTM1JRTEVodm06bjhrU05wcGtSY1dfaW1jTEdsMHVMUQ==",
  },
});

// async function checkElasticsearch() {
//   try {
//     const resp = await client.info();
//   } catch (error) {
//     console.error("Error connecting to Elasticsearch:", error);
//   }
//   //   // Let's search!
//     const searchResult = await client.search({
//       index: "search-blogposts",
//       q: "Hutchinson",
//     });
//     console.log(searchResult.hits.hits);

//   const result = await client.search({
//     index: "search-blogposts",
//     size: 10, // Temporarily fetch 10 documents
//     body: {
//       query: {
//         match_all: {}, // A simple match_all query
//       },
//     },
//   });
//   console.log("Elasticsearch response:", result.body); // Log the entire response
// }

// checkElasticsearch();

module.exports = client;
