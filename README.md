# Searxbot
A Telegram Bot that forwards search results from a public [Searx](https://github.com/asciimoo/searx) instance.

_[@SearxBot](https://t.me/SearxBot) on Telegram_

## Usage
Example usage:

![SearxBot Usage Example](https://github.com/fuerbringer/searxbot/raw/master/usage.png)

## Setup
Every time you use this bot your searches are sent to the server the bot is running on, which isn't optimal for privacy. That is why I recommend self hosting it! Here's how:
### Classic
The _old school_ way of installing Searxbot is quite simple:

1.  `git clone` this repository somewhere on your server.
2.  Rename the `auth.json.example` file to `auth.json` and fill in your credidentials.
3.  Run `npm install`
4.  Finally, run `npm start`. This will start the bot.

### Docker

1.  `git clone` this repository somewhere on your server.
2.  Rename the `auth.json.example` file to `auth.json` and fill in your credidentials.
3.  Build the Docker image like this: `docker build -t fuerbringer/searxbot .`
4.  Run the Docker image: `docker run -d --name searxbot fuerbringer/searxbot`

## Searx instances
A list of public Searx instances can be found [here](https://github.com/asciimoo/searx/wiki/Searx-instances).
