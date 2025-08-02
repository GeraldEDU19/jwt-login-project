const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schemas = {
    login: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
                pattern: '^[a-zA-Z0-9_]+$'
            },
            password: {
                type: 'string',
                minLength: 8,
                maxLength: 100
            },
            remember: {
                type: 'boolean'
            }
        },
        required: ['username', 'password'],
        additionalProperties: false
    },

    userRegistration: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
                pattern: '^[a-zA-Z0-9_]+$'
            },
            email: {
                type: 'string',
                format: 'email',
                maxLength: 100
            },
            password: {
                type: 'string',
                minLength: 8,
                maxLength: 100
            }
        },
        required: ['username', 'email', 'password'],
        additionalProperties: false
    }
};

const compiledSchemas = {};
Object.keys(schemas).forEach(key => {
    compiledSchemas[key] = ajv.compile(schemas[key]);
});

const validateSchema = (schemaName) => {
    return (req, res, next) => {
        const validator = compiledSchemas[schemaName];

        if (!validator) {
            return res.status(500).json({ error: `Schema ${schemaName} not found` });
        }

        const valid = validator(req.body);

        if (!valid) {
            const errors = validator.errors.map(error => {
                let message = '';
                const fieldName = error.instancePath.slice(1) || error.params?.missingProperty || 'unknown';
                
                switch (error.keyword) {
                    case 'required':
                        message = `Field '${error.params.missingProperty}' is required`;
                        break;
                    case 'minLength':
                        message = `Field '${fieldName}' must be at least ${error.params.limit} characters long`;
                        break;
                    case 'maxLength':
                        message = `Field '${fieldName}' cannot exceed ${error.params.limit} characters`;
                        break;
                    case 'pattern':
                        if (fieldName === 'username') {
                            message = `Username can only contain letters, numbers, and underscores`;
                        } else {
                            message = `Field '${fieldName}' has invalid format`;
                        }
                        break;
                    case 'format':
                        if (error.params.format === 'email') {
                            message = `Please enter a valid email address`;
                        } else {
                            message = `Field '${fieldName}' has invalid ${error.params.format} format`;
                        }
                        break;
                    case 'additionalProperties':
                        message = `Field '${error.params.additionalProperty}' is not allowed`;
                        break;
                    case 'type':
                        message = `Field '${fieldName}' must be of type ${error.params.type}`;
                        break;
                    default:
                        message = `Field '${fieldName}': ${error.message}`;
                }

                return {
                    field: fieldName,
                    message: message,
                    value: error.data
                };
            });

            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        next();
    };
};

module.exports = {
    validateSchema,
    schemas
};