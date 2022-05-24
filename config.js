//create the configuration files

//container for all the environment variables

var environments = {};

//stating environment as the default

environments.staging = {
    'httpPort':3000,
    'httpsPort': 3001,
    'envName':'staging'

};

//production environment

environments.production = {
    'httpPort':5000,
    'httpsPort': 5001,
    'envName':'production'

};

//determine the environment  to be used
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check the environment is among the environments
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//export the module
module.exports = environmentToExport;