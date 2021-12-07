const JSONStream = require("JSONStream");
const es = require("event-stream");
const fs = require("fs");
const algoliasearch = require("algoliasearch");
const _ = require("lodash");

// create Algolia client/index
const appId = // your App ID;
const writeApiKey =  // your write API Key with browse ACL;
const indexName = // your index name;

const client = algoliasearch(appId, writeApiKey);
const index = client.initIndex(indexName);

let list = [];
// set count of records to update
let count = 200;

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
        // retrieve n objects from array
        const records = _.take(list, count);
        console.log(`Starting transfer of ${records.length} items to index`);
        Promise.all(
          records.map((hit) => {
            ///////
            // update attribute in hit
            let newAccessStrings = [
              ...hit.accessStrings,
              `NEW-2021-12-6-SINGLEUPDATE${count}-RD10`,
            ];
            let update = {
              accessStrings: newAccessStrings,
              objectID: hit.objectID,
            };
            ///////
            index.partialUpdateObject(update).then((response) => {
              console.log(response);
            });
          })
        );
        console.log(
          `Finished indexing to ${indexName} with ${records.length} objects in single updates`
        );
      }
    )
  );
