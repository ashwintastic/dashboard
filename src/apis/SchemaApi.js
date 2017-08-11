const fs = require('fs');
const path = require('path');
import _ from 'lodash';
import express from 'express';
const router = express.Router();

const SCHEMA_PATH = "node_modules/botworx-schema/flow/";
var schemaRef = {};

router.get('/refs', async (req, res) => {
  var referenceSchemas = fs.readdirSync(SCHEMA_PATH);
  for (var schemaIndex = 0; schemaIndex < referenceSchemas.length; schemaIndex++) {
    var schema = referenceSchemas[schemaIndex];
    if (path.extname(schema) === ".json") {
      var schemaJSON = JSON.parse(fs.readFileSync(SCHEMA_PATH + schema));
      let obj = {};
      obj[schema] = schemaJSON;
      _.assignIn(schemaRef, obj);
    }
  }
  console.log('loadReferenceSchemas', schemaRef);
  schemaRef['oldKeywordFormat.json'].additionalProperties.format = 'table';
  schemaRef['flow.json'].format = 'grid';
  res.send({ schemaRef });
});

export const schemaRouter = router;