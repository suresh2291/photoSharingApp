function dbConnection(username, password, database, options) {
    // Default options
    options = options || {};
  
    // Construct connection string
    let connectionString = options.hostname || 'mongodb://';
    
    // Check for username
    if (username) {
      connectionString += `${username}:`;
    }
    
    // Check for password
    if (password) {
      connectionString += `${password}@`;
    }
    
    // Check for hostname (Atlas cluster name)
    connectionString += options.cluster || 'localhost:27017';
    
    // Check for database
    if (database) {
      connectionString += `/${database}`;
    }
    
    // Add options to connection string
    const uriOptions = [];
    if (options.retryWrites) {
      uriOptions.push('retryWrites=true');
    }
    if (options.w) {
      uriOptions.push(`w=${options.w}`);
    }
    if (options.authSource) {
      uriOptions.push(`authSource=${options.authSource}`);
    }
    if (options.replicaSet) {
      uriOptions.push(`replicaSet=${options.replicaSet}`);
    }
    if (uriOptions.length > 0) {
      connectionString += `?${uriOptions.join('&')}`;
    }
  
    return connectionString;
  }
  
  module.exports = { dbConnection }