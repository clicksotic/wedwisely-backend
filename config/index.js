const local = require('./environments/local');
const development = require('./environments/development');
const production = require('./environments/production');

const environments = {
  local,
  development,
  production
};

function getConfig() {
  const env = process.env.NODE_ENV || 'local';
  const config = environments[env];
  
  if (!config) {
    throw new Error(`Environment '${env}' not found`);
  }
  
  return config;
}

function getDatabaseConfig() {
  const config = getConfig();
  return {
    uri: config.database.uri,
    options: config.database.options
  };
}

function getServerConfig() {
  const config = getConfig();
  return config.server;
}

function getCorsConfig() {
  const config = getConfig();
  return config.cors;
}

function getLoggingConfig() {
  const config = getConfig();
  return config.logging;
}

function getFeaturesConfig() {
  const config = getConfig();
  return config.features;
}

module.exports = {
  getConfig,
  getDatabaseConfig,
  getServerConfig,
  getCorsConfig,
  getLoggingConfig,
  getFeaturesConfig,
  currentEnvironment: process.env.NODE_ENV || 'local'
};