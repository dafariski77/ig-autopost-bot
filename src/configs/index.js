import dotenv from "dotenv";

dotenv.config();

export default {
  telegramKey: process.env.TELEGRAM_API_KEY,
  instagramApiId: process.env.INSTAGRAM_API_ID,
  instagramApiSecret: process.env.INSTAGRAM_API_SECRET,
  instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
  instagramPageId: process.env.INSTAGRAM_PAGE_ID,
};
