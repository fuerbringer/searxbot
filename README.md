# Searxbot
A serverless [Telegram](https://telegram.org/) chatbot to search the internet! Add it to your Telegram: [@SearxBot](https://t.me/SearxBot)

## Example usage

![SearxBot Usage Example](https://github.com/fuerbringer/searxbot/raw/master/usage.png)

## Setup
The serverless chatbot Searxbot works best while deployed on [AWS Lambda](https://aws.amazon.com/lambda/).

### Steps to deploy

1. Clone this repository: `git clone https://github.com/fuerbringer/searxbot.git && cd searxbot`
2. Install the necessary dependencies and claudia: `npm install && npm install -g claudia`
3. Deploy the bot to AWS Lambda: `claudia create --region eu-central-1 --api-module bot`
4. Re-deploy after you've made your changes: `claudia update`

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
