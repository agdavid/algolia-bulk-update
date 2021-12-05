# Get Started

1. From the command line, clone the repo:

```bash
$ git clone git@github.com:agdavid/algolia-bulk-update.git
```

2. From the command line, install the node modules:

```bash
$ npm install
```

3. In each file `bulkRetrieval.js` and `bulkUpdate.js` add your credentials:

```
const appId = // your App ID;
const writeApiKey = // your write API Key with browse ACL;
const indexName = // your index name;
```

4. In `bulkUpdate.js` set your batch size:

```
let batchSize = // set batch size;
```

# Retrieve Records

Run the command below to retrieve records from an index and save to a local file `records.json`:

```bash
$ node bulkRetrieval.js
```

# Update Records

Around line 36 of `bulkUpdate.js` you can change the attributes or add new attributes to your hits. These will be included in the partialUpdateObjects.

Run the command below to retrieve records from an index and save to a local file `records.json`:

```bash
$ node bulkUpdate.js
```
