const algoliasearch = require("algoliasearch");
const fs = require("fs");

// create Algolia client/index
const appId = // your App ID;
const writeApiKey = // your write API Key with browse ACL;
const indexName = // your index name;

const client = algoliasearch(appId, writeApiKey);
const index = client.initIndex(indexName);

let hits = [];

const bulkRetrieval = () => {
  // browse to retrieve records
  // https://www.algolia.com/doc/api-reference/api-methods/browse/
  index
    .browseObjects({
      query: "", // Empty query will match all records
      batch: (batch) => {
        hits = hits.concat(batch);
      },
    })
    .then(() => {
      console.log(hits.length);
      // save to file
      try {
        const data = JSON.stringify(hits);
        fs.writeFileSync("./records.json", data, "utf-8");
        console.log(`File is written successfully`);
      } catch (err) {
        console.log(`Error writing file: ${err}`);
      }
    });
};

bulkRetrieval();
