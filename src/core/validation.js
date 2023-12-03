const Joi = require('joi'); // 👈 1


const cleanupJoiError = (
  error // 👈 1
) =>
  error.details.reduce((resultObj, { message, path, type }) => { // 👈 2
    const joinedPath = path.join('.') || 'value'; // 👈 3
    // 👇 4
    if (!resultObj[joinedPath]) {
      resultObj[joinedPath] = [];
    }
    resultObj[joinedPath].push({
      type,
      message,
    });

    return resultObj; // 👈 5
  }, {});

// 👇 8
const JOI_OPTIONS = {
  abortEarly: true,
  allowUnknown: false,
  context: true,
  convert: true,
  presence: 'required',
};

// 👇 2
const validate = (schema) => {
  // 👇 3
  if (!schema) {
    schema = {
      query: {},
      body: {},
      params: {},
    };
  }

  // 👇 4
  return (ctx, next) => {
    const errors = {}; // 👈 5

    // 👇 6
    if (!Joi.isSchema(schema.params)) {
      schema.params = Joi.object(schema.params || {});
    }

    // 👇 7
    const { error: paramsError, value: paramsValue } = schema.params.validate(
      ctx.params,
      JOI_OPTIONS // 👈 8
    );

    // 👇 9
    if (paramsError) {
      errors.params = cleanupJoiError(paramsError);
    } else {
      ctx.params = paramsValue;
    }

    // 👇 10
    if (Object.keys(errors).length) {
      ctx.throw(400, 'Validation failed, check details for more information', {
        code: 'VALIDATION_FAILED',
        details: errors,
      });
    }



    if (!Joi.isSchema(schema.body)) {
      schema.body = Joi.object(schema.body || {});
    }
    
    const { error: bodyError, value: bodyValue } = schema.body.validate(
      ctx.request.body,
      JOI_OPTIONS
    );
    
    if (bodyError) {
      errors.body = cleanupJoiError(bodyError);
    } else {
      ctx.request.body = bodyValue;
    }
    

    return next(); // 👈 4
  };
};
module.exports = validate; // 👈 2
