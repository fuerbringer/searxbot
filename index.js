var telegramBot = require('node-telegram-bot-api');
var mysql = require('mysql2');
var jsonfile = require('jsonfile');
var commands = require('./libs/commands.js');

// Default Searx instance
default_instance = 'https://searx.ch';

function getSearxArgs(obj) {
	if(obj) {
		if(obj.token.length &&
			obj.db_host.length &&
			obj.db_user.length &&
			obj.db_pass.length &&
			obj.db_name.length) {
		}
	} else {
		// parse from command line args directly
		var argv = require('minimist')(process.argv.slice(2));
		obj = {
			token: argv.token,
			db_host: argv.db_host,
			db_user: argv.db_user,
			db_pass: argv.db_pass,
			db_name: argv.db_name
		};
	}
	return obj;
}

/**
 * Read DB info and bot token from authentication file
 */
jsonfile.readFile('auth.json', function(err, obj) {
	var args = getSearxArgs(obj);

	// establish MySQL connection
	connection = mysql.createPool({
		connectionLimit: 25,
		host: args.db_host,
		user: args.db_user,
		password: args.db_pass,
		database: args.db_name});

	// Setup polling way
	bot = new telegramBot(args.token, {polling: true});

	/**
	 * Image search with up to 5 results
	 */
	bot.onText(/\/searximg "(.+)"$/, commands.searximg);
	bot.onText(/\/searximg '(.+)'$/, commands.searximg);

	/**
	 * Perform search with custom amount of results
	 */
	bot.onText(/\/searx "(.+)" (.+)$/, commands.searx);
	bot.onText(/\/searx '(.+)' (.+)$/, commands.searx);

	/**
	 * Short search with up to 5 results
	 */
	bot.onText(/\/searx "(.+)"$/, commands.searx);
	bot.onText(/\/searx '(.+)'$/, commands.searx);

	/**
	 * Set instance (where searches are fetched from)
	 */
	bot.onText(/\/setinstance (.+)/, commands.setInstance);

	/**
	 * Help output
	 */
	bot.onText(/\/help/, commands.help);

});
