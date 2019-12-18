module.exports.connect = (queryToBeExecuted) => {
    let pg = require('pg');
    let connectionString = 'postgres://rqudjcey:0XBP0dAZ7j39d5Gu3nYuC3xl95Rz-Hr0@balarama.db.elephantsql.com:5432/rqudjcey'

    let client = new pg.Client(connectionString);

    client.connect(function(err){
        queryToBeExecuted(client);
    });
}
