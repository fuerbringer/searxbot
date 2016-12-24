var telegramBot = require('node-telegram-bot-api');
var mysql = require('mysql2');
var jsonfile = require('jsonfile');
var commands = require('./libs/commands.js');

// Default Searx instance
var default_instance = 'https://searx.ch';

/**
 * Read DB info and bot token from authentication file
 */
jsonfile.readFile('auth.json', function(err, obj) {
	// Telegram bot token
	var token = obj.token;
	// establish MySQL connection
	connection = mysql.createPool({
		connectionLimit: 25,
		host: obj.db_host,
		user: obj.db_user,
		password: obj.db_pass,
		database: obj.db_name});

	// Setup polling way
	bot = new telegramBot(token, {polling: true});

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
