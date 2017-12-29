var telegramBot = require('node-telegram-bot-api');
var sqlite3 = require('sqlite3');
var jsonfile = require('jsonfile');
var commands = require('./libs/commands.js');

// Default Searx instance
default_instance = 'https://searx.ch';

function getSearxArgs(obj) {
	if(obj) {
		if(obj.token.length &&
			obj.db_name.length) {
		}
	} else {
		// parse from command line args directly
		var argv = require('minimist')(process.argv.slice(2));
		obj = {
			token: argv.token,
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

	// establish SQLite connection
	db = new sqlite3.Database(args.db_name);

	// Setup polling way
	bot = new telegramBot(args.token, {polling: true});

	/**
	 * Image search with up to 5 results
	 */
	bot.onText(/^\/searximg "(.+)"$/, commands.searximg);
	bot.onText(/^\/searximg '(.+)'$/, commands.searximg);

	/**
	 * Perform search with custom amount of results
	 */
	bot.onText(/^\/searx "(.+)" (.+)$/, commands.searx);
	bot.onText(/^\/searx '(.+)' (.+)$/, commands.searx);

	/**
	 * Short search with up to 5 results
	 */
	bot.onText(/^\/searx "(.+)"$/, commands.searx);
	bot.onText(/^\/searx '(.+)'$/, commands.searx);

	/**
	 * Set instance (where searches are fetched from)
	 */
	bot.onText(/^\/setinstance (.+)/, commands.setInstance);

	/**
	 * Help output
	 */
	bot.onText(/^\/help/, commands.help);

});
