var TelegramBot = require('node-telegram-bot-api');
var mysql = require('mysql2');
var jsonfile = require('jsonfile');

jsonfile.readFile('auth.json', function(err, obj) {
	var token = obj.token;
	var connection = mysql.createConnection({
		host: obj.db_host,
		user: obj.db_user,
		password: obj.db_pass,
		database: obj.db_name});

	// Setup polling way
	var bot = new TelegramBot(token, {polling: true});

	/**
	 * Perform search
	 */
	bot.onText(/\/searx (.+)/, function (msg, match) {
		var tg_id = msg.chat.id;	// Telegram Chat Id
		var search_term = match[1]; // Search term
	});

	/**
	 *
	 */
	bot.onText(/\/setinstance (.+)/, function (msg, match) {
		var tg_id = msg.chat.id;	// Telegram Chat Id
		var url = match[1];			// Instance URL


	});
});
