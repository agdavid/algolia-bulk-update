const JSONStream = require("JSONStream");
const es = require("event-stream");
const fs = require("fs");
const algoliasearch = require("algoliasearch");
const _ = require("lodash");

// create Algolia client/index
const appId = // your App ID;
const writeApiKey = // your write API Key with browse ACL;
const indexName = // your index name;

const client = algoliasearch(appId, writeApiKey);
const index = client.initIndex(indexName);

let list = [];
// set batch size
let batchSize = 1000;

console.log("Starting JSON processing");
// read JSON from file
fs.createReadStream("records.json", { encoding: "utf8" })
  .pipe(JSONStream.parse("*"))
  .pipe(
    es.through(
      (obj) => {
        list.push(obj);
      },
      () => {
        console.log("Completed JSON processing");
        console.log(`Chunking data into chunks of ${batchSize}`);
        const chunks = _.chunk(list, batchSize);
        console.log("Starting transfer of items to index");
        Promise.all(
          chunks.map((chunk) => {
            let updatedChunk = chunk.map((hit) => {
              // update attribute in hit
              let newAccessStrings = [
                ...hit.accessStrings,
                `NEW-2021-12-5-BATCH${batchSize}`,
              ];
              return {
                objectID: hit.objectID,
                accessStrings: newAccessStrings,
              };
            });
            console.log(updatedChunk);
            index.partialUpdateObjects(updatedChunk).then((response) => {
              console.log(response);
            });
          })
        );
        console.log(
          `Finished bulk update to ${indexName} with ${list.length} objects in batch size ${batchSize}`
        );
      }
    )
  );
