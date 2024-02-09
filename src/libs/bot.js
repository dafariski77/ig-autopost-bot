import TelegramBot from "node-telegram-bot-api";
import configs from "../configs/index.js";

const bot = new TelegramBot(configs.telegramKey, { polling: true });

export default bot;
