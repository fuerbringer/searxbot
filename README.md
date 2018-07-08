# Searxbot
A serverless [Telegram](https://telegram.org/) chatbot to search the internet! Add it to your Telegram: [@SearxBot](https://t.me/SearxBot)

## Example usage

![SearxBot Usage Example](https://github.com/fuerbringer/searxbot/raw/master/usage.png)

## Setup
The serverless chatbot Searxbot works best while deployed on [AWS Lambda](https://aws.amazon.com/lambda/).

### Steps to deploy

#### AWS Lambda

1. Clone this repository: `git clone https://github.com/fuerbringer/searxbot.git && cd searxbot`
2. Install the necessary dependencies and claudia: `npm install && npm install -g claudia`
3. Deploy the bot to AWS Lambda: `claudia create --region eu-central-1 --api-module bot`
4. Re-deploy after you've made your changes: `claudia update`

#### Locally

You'll first want to put your Telegram Bot token into `.env` like so:

```
BOT_TOKEN=AAAAAAAAAA:123tokenfrombotfather321
```

Then run `npm install` and `npm start`. Done.

#### Docker

First set up your `.env` file as described above. Then you can build the Docker image (`docker build -t searxbot .`) and run it (`docker run -d searxbot`). Done.

## Technologies used

- Node (6.10)
- AWS Lambda
- Claudia.js
- claudia-bot-builder
- minimal-request-promise

## Useful links and resources
- [Hello World Chatbot using Lambda](https://claudiajs.com/tutorials/hello-world-chatbot.html)
- [GitHub Repository claudia-bot-builder](https://github.com/claudiajs/claudia-bot-builder)
- [Amazon AWS Lambda](https://aws.amazon.com/lambda/)
- [Public Searx instances](https://github.com/asciimoo/searx/wiki/Searx-instances)
- [Register new bots with BotFather](https://core.telegram.org/bots#6-botfather)
