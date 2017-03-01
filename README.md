# SearX Bot
A Telegram Bot that forwards search results from a public [SearX](https://github.com/asciimoo/searx) instance.

_@SearxBot on Telegram_

## Usage
Example usage:

![SearxBot Usage Example](https://github.com/fuerbringer/searxbot/raw/master/usage.png)

## Setup
Setup is quite simple if you want to host this bot yourself.

1.  `git clone` this repository somewhere on your server.
2.  Import the `searx.sql` file from the `install` directory into your MySQL database.
3.  Rename the `auth.json.example` file to `auth.json` and fill in your credidentials.
4.  Run `npm install`
5.  Finally, run `npm start`. This will start the bot.

## SearX instances
A list of public SearX instances can be found [here](https://github.com/asciimoo/searx/wiki/Searx-instances).
