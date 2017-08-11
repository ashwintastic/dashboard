var Validator = require('jsonschema').Validator;

function loadReferenceSchemas(validator, schemaRef) {
  var referenceSchemas = schemaRef;
  Object.keys(referenceSchemas).map(x => {
    validator.addSchema(referenceSchemas[x], '/' + x);
  })  
}

export function getJsonValidationResult(jsonToValidate, schemaRef) {
    // Create validator object
    var validator = new Validator();
    var flowSchema = schemaRef['flow.json'];
    loadReferenceSchemas(validator, schemaRef);

    // Remove version, id and createdDate for validation
    if (typeof (jsonToValidate.__v) !== "undefined") {
      delete jsonToValidate.__v;
    }

    if (jsonToValidate.createdDate) {
      delete jsonToValidate.createdDate;
    }

    if (jsonToValidate._id) {
      delete jsonToValidate._id;
    }

    // Validate
    return validator.validate(jsonToValidate, flowSchema);
}

export function validateJSON(jsonToValidate, schemaRef) {
    try {
        var result = getJsonValidationResult(jsonToValidate, schemaRef);
        if (result.errors) {
            console.log("RESULT errors:");
            for (var errorIndex = 0; errorIndex < result.errors.length; errorIndex++) {
                console.log("Schema Error: " + result.errors[errorIndex]);
            }
        }

        return result.valid;
    } catch (exception) {
        console.log("VALIDATION EXCEPTION: " + exception);
    }

    return false;
}
