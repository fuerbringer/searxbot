# SearX Bot
A Telegram Bot that forwards search results from a public [SearX](https://github.com/asciimoo/searx) instance.

_@SearxBot on Telegram_

## Usage
Example usage:

![SearxBot Usage Example](https://github.com/fuerbringer/searxbot/raw/master/usage.png)

## Setup
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

## SearX instances
A list of public SearX instances can be found [here](https://github.com/asciimoo/searx/wiki/Searx-instances).
