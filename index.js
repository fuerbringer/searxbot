'use strict';

var telegramBot = require('node-telegram-bot-api');
var mysql = require('mysql2');
var jsonfile = require('jsonfile');
var request = require('request');

/**
 * Read DB info and bot token from authentication file
 */
jsonfile.readFile('auth.json', function(err, obj) {
	// Telegram bot token
	var token = obj.token;
	// establish MySQL connection
	var connection = mysql.createConnection({
		host: obj.db_host,
		user: obj.db_user,
		password: obj.db_pass,
		database: obj.db_name});

	// Setup polling way
	var bot = new telegramBot(token, {polling: true});

	/**
	 * Perform search
	 */
	bot.onText(/\/searx (.+)/, function (msg, match) {
		var tg_id = msg.chat.id;	// Telegram Chat Id
		var search_term = match[1]; // Search term
		var sx_instance = '';		// url

		var sql = "SELECT url, instance.id FROM instance WHERE chat_id=(SELECT id FROM chat WHERE tg_id='" + tg_id + "') ORDER BY instance.id DESC LIMIT 1";
		connection.execute(sql, function(err, results, fields) {
			sx_instance = results[0].url;
			sx_instance += "?q=" + search_term + "&format=json";

			// TODO: Make sure only instances with http/https get executed
			request({
				url: sx_instance,
				json: true
			}, function(err, response, body) {
				if(!err && response.statusCode === 200) {
					// OK
					// TODO: Display searx results in a compact, yet informative way
				} else {
					bot.sendMessage(tg_id, "Sorry! Something went wrong with that query. (Bad Request)");
				}
			});

		});

	});

	/**
	 * Set the instance for the chat that'll be used to
	 * fetch searx results
	 */
	bot.onText(/\/setinstance (.+)/, function (msg, match) {
		var tg_id = msg.chat.id;	// Telegram Chat Id
		//var tg_foreign;
		var url = match[1];			// Instance URL

		// TODO: only accept with http / https
		if(url.length > 0) {
			var out = '';

			// Set SearX instance and if a chat
			// entry doesn't exist, insert a new one
			var sql_chat = "INSERT IGNORE INTO chat (tg_id) values(?)";
			connection.execute(sql_chat, [tg_id], function(err, results, fields) {
			});

			// Log/Insert the search instance url for this chat
			var sql_instance = "INSERT IGNORE INTO instance (chat_id, url) "
				+ " VALUES ((SELECT id FROM chat WHERE tg_id='" + tg_id + "'),?)";
			connection.execute(sql_instance, [url], function(err, results, fields) {
				out += "Got it! Next time you /searx I'll fetch the results from '" + url + "'.";
				bot.sendMessage(tg_id, out);
			});


		} else {
			// /setinstance Needs an argument
			bot.sendMessage(tg_id, 'Please enter a valid URL or IP');
		}
	});


	/**
	 * Help output
	 */
	bot.onText(/\/help/, function (msg, match) {
		var tg_id = msg.chat.id;	// Telegram Chat Id
		bot.sendMessage(tg_id,
			"SearxBot - Licensed under the AGPL-3.0 License.\n\n"
			+ "Commands:\n"
			+ "/setinstance [url]\n"
			+ "/searx [search_term]\n"
			+ "/help\n\n"
			+ "Source Code: https://github.com/fuerbringer/searxbot"
			);
	});

});
