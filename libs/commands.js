const jsonfile = require('jsonfile');
const request = require('request');

/**
 * Performs web search and returns to chat
 */
exports.searx = function searx(msg, match) {
	const tgId = msg.chat.id;	// Telegram Chat Id
	var sxInstance = '';		// url
	const search_term = match[1]; // Search term
	var sxAmount = 5;		// Default amount of results
	var validTerm = true;

	// Validation
	if(match[2]) {
		var sxTmpAmount = parseInt(match[2]);
		if(sxTmpAmount <= 5 && sxTmpAmount >= 1) {
			sxAmount = sxTmpAmount;
		} else {
			bot.sendMessage(tgId, "Can't do `" + sxTmpAmount + "` searches! Returning 5 instead...");
			validTerm = false;
		}
	}
	if(search_term.length <= 0) {
			bot.sendMessage(tgId, "Invalid search term. Please try something longer than 0 characters.");
			validTerm = false;
	}
	// End validation


	if(validTerm) {
		const sql = "SELECT instance AS url FROM chat WHERE tg_id=? LIMIT 1";
		const sql_chat = "INSERT OR IGNORE INTO chat (tg_id, instance) values(?, ?)";

		// Set SearX instance and if a chat entry doesn't exist, insert a new one
		const stmt1 = db.prepare(sql_chat);
		stmt1.run(tgId, default_instance);

		db.serialize(() => {
			var stmt = db.prepare(sql);
			db.each(sql, tgId, function(err, row) {
				// TODO: Clean this up
				if(search_term.indexOf("&") == -1 && search_term.indexOf("?") == -1) {
					if(!err && row !== undefined) {
						sxInstance = row.url;
					} else {
						sxInstance = default_instance;
					}

					sxInstance += "?q=" + search_term + "&format=json";

					// TODO: Make sure only instances with http/https get executed
					request({
						url: sxInstance,
						json: true
					}, function(err, response, body) {
						if(!err && response.statusCode === 200) {
							// OK
							if(!err && body['results'].length > 0) {
								// Found some search results
								const len = (body['results'].length >= sxAmount ? sxAmount : body['results'].length);

								for(var i = 0; i < len; i++) {
									var out = '';
									out += '[' +  body['results'][i]['title']
									+ '](' + body['results'][i]['url'] + ')\n';
									out += 'Search results by:';
									for(var y = 0; y < body['results'][i]['engines'].length; y++) {
										out += ' ' + body['results'][i]['engines'][y];
									};

									bot.sendMessage(tgId, out, {"parse_mode":"Markdown"});
								} // End for

							} else {
								bot.sendMessage(tgId, "<b>Sorry!</b> That did not yield any results.", {"parse_mode":"HTML"});
							} // End if

						} else {
							bot.sendMessage(tgId, "Sorry! Something went wrong with that query. (Bad Request)");
						} // End if
					});
				}
			}) // End DB foreach
		});
	} // End if validTerm
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
exports.setInstance = function (msg, match) {
	const tgId = msg.chat.id;	// Telegram Chat Id
	const url = match[1];			// Instance URL

	// TODO: 2. Only accept urls with a valid, running SearX instance
	if(url.length > 0 && (url.includes("http://") || url.includes("https://"))) {
		var out = '';

		// Set SearX instance and if a chat entry doesn't exist, insert a new one
		const sql_chat = "INSERT OR IGNORE INTO chat (tg_id, instance) values(?, ?)";
		const stmt1 = db.prepare(sql_chat);
		stmt1.run(tgId, url);

		const sql_instance = "UPDATE chat SET instance=? WHERE tg_id=?";
		const stmt2 = db.prepare(sql_instance);
		stmt2.run(url, tgId);

		out += "Got it! Next time you /searx I'll fetch the results from '" + url + "'.";
		bot.sendMessage(tgId, out);
	} else {
		// /setinstance Needs an argument
		bot.sendMessage(tgId, 'Please enter a valid URL or IP');
	}
};


/**
 * /help command
 */
exports.help = function (msg, match) {
	const tgId = msg.chat.id;	// Telegram Chat Id
	const helpStr =
		"SearxBot - Licensed under the AGPL-3.0 License.\n\n"
			+ "Commands:\n"
			+ "/setinstance [url]\n"
			+ "/searx \"search term\"\n"
			+ "/searx \"search term\" 3\n"
			+ "/help\n\n"
			+ "Source Code: https://github.com/fuerbringer/searxbot";

	bot.sendMessage(tgId, helpStr);
};
