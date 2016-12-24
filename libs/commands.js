var jsonfile = require('jsonfile');
var request = require('request');

/**
 * Performs web search and returns to chat
 */
exports.searx = function searx(msg, match) {
	var tg_id = msg.chat.id;	// Telegram Chat Id
	var sx_instance = '';		// url
	var search_term = match[1]; // Search term
	var search_amount = 5;		// Default amount of results
	if(match[2]) {
		var sx_amount_temp = parseInt(match[2]);
		if(sx_amount_temp <= 5 && sx_amount_temp >= 1) {
			search_amount = sx_amount_temp;
		} else {
			bot.sendMessage(tg_id, "Can't do `" + sx_amount_temp + "` searches! Returning 5 instead...");
		}
	}

	var sql = "SELECT url, instance.id FROM instance WHERE chat_id=(SELECT id FROM chat WHERE tg_id='" + tg_id + "') ORDER BY instance.id DESC LIMIT 1";
	connection.execute(sql, function(err, results, fields) {
		// TODO: Clean this up
		if(search_term.indexOf("&") == -1 && search_term.indexOf("?") == -1) {
			if(!err && results.length > 0) {
				sx_instance = results[0].url;
			} else {
				sx_instance = default_instance; 
			}

			sx_instance += "?q=" + search_term + "&format=json";

			// TODO: Make sure only instances with http/https get executed
			request({
				url: sx_instance,
				json: true
			}, function(err, response, body) {
				if(!err && response.statusCode === 200) {
					// OK
					if(!err && body['results'].length > 0) {
						// Found some search results
						var len = (body['results'].length >= search_amount ? search_amount : body['results'].length);

						//bot.sendMessage(tg_id, "Here's your SearX results for `" + body['query'] + "`!");
						for(var i = 0; i < len; i++) {
							var out = '';
							out += '[' +  body['results'][i]['title']
								+ '](' + body['results'][i]['url'] + ')\n';
							out += 'Search results by:';
							for(var y = 0; y < body['results'][i]['engines'].length; y++) {
								out += ' ' + body['results'][i]['engines'][y];
							};

							bot.sendMessage(tg_id, out, {"parse_mode":"Markdown"});
						} // End for

					} else {
						bot.sendMessage(tg_id, "<b>Sorry!</b> That did not yield any results.", {"parse_mode":"HTML"});
					} // End if

				} else {
					bot.sendMessage(tg_id, "Sorry! Something went wrong with that query. (Bad Request)");
				} // End if
			});
		}

	});

};


/**
 * Perform img search
 */
exports.searximg = function searximg(msg, match) {
	// TODO
};


/**
 * Set the instance for the chat that'll be used to
 * fetch searx results
 */
exports.setinstance = function (msg, match) {
	var tg_id = msg.chat.id;	// Telegram Chat Id
	//var tg_foreign;
	var url = match[1];			// Instance URL

	// TODO: 2. Only accept urls with a valid, running SearX instance
	if(url.length > 0 && (url.includes("http://") || url.includes("https://"))) {
		var out = '';

		// Set SearX instance and if a chat
		// entry doesn't exist, insert a new one
		var sql_chat = "INSERT IGNORE INTO chat (tg_id) values(?)";
		connection.execute(sql_chat, [tg_id], function(err, results, fields) {
		});

		var sql_id = "(SELECT id FROM chat WHERE tg_id='" + tg_id + "')";

		// Log/Insert the search instance url for this chat
		var sql_instance = "INSERT IGNORE INTO instance (chat_id, url) "
			+ " VALUES (" + sql_id + ",?)";
		connection.execute(sql_instance, [url], function(err, results, fields) {
			// Delete old instance:
			var sql_del = "DELETE FROM instance WHERE instance.chat_id=" + sql_id + " AND instance.url<>" + url;
			connection.execute(sql_del, function(err, results, fields) {});

			// Confirmation message:
			out += "Got it! Next time you /searx I'll fetch the results from '" + url + "'.";
			bot.sendMessage(tg_id, out);
		});


	} else {
		// /setinstance Needs an argument
		bot.sendMessage(tg_id, 'Please enter a valid URL or IP');
	}
});


/**
 * /help command
 */
exports.help = function (msg, match) {
	var tg_id = msg.chat.id;	// Telegram Chat Id
	bot.sendMessage(tg_id,
		"SearxBot - Licensed under the AGPL-3.0 License.\n\n"
			+ "Commands:\n"
			+ "/setinstance [url]\n"
			+ "/searx \"search term\"\n"
			+ "/searx \"search term\" 3\n"
			+ "/help\n\n"
			+ "Source Code: https://github.com/fuerbringer/searxbot"
	);
});
