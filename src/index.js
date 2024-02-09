import http from "http";
import express from "express";
import login from "./utils/login.js";
import ig from "./libs/instagram.js";
import requestPromise from "request-promise";
import bot from "./libs/bot.js";

const { get } = requestPromise;

const app = express();

const server = http.createServer(app);

app.get("/", async (req, res) => {
  return res.send("ok");
});

const userCredentials = {};
const imageUrls = [];

bot.onText(/\/login/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Enter your instagram username : ");
  bot.once("text", (msg) => {
    const username = msg.text.trim();

    bot.deleteMessage(chatId, msg.message_id);

    bot.sendMessage(chatId, "Enter your password : ");
    bot.once("text", async (msg) => {
      const password = msg.text.trim();

      bot.deleteMessage(chatId, msg.message_id);

      const isValid = await login(username, password);

      if (isValid) {
        userCredentials[chatId] = { username, password };

        bot.sendMessage(chatId, "Upload a picture album : ");

        bot.on("photo", async (msg) => {
          const photoId = msg.photo[msg.photo.length - 1].file_id;
          const photoUrl = await bot.getFileLink(photoId);

          imageUrls.push(photoUrl);
        });

        bot.onText(/\upload (.+)/, async (msg, match) => {
          if (imageUrls.length > 0) {
            try {
              const imagePromises = imageUrls.map(async (url) => {
                const imageBuffer = await get({ url, encoding: null });
                return { file: imageBuffer };
              });

              const items = await Promise.all(imagePromises);

              await ig.publish.album({
                caption: `${match[1]} \n\n Post by t.me/beruk77_bot`,
                items: items,
              });

              imageUrls.length = 0;

              bot.sendMessage(chatId, "Success Post");
            } catch (error) {
              // console.log(error);
              bot.sendMessage(
                chatId,
                "Somethnig error. Make sure your photo have same size"
              );
            }
          } else {
            bot.sendMessage(chatId, "No photos received. Process canceled.");
          }
        });
      } else {
        bot.sendMessage(chatId, "Invalid credentials. Please try again.");
      }
    });
  });
});

bot.onText(/\/cancel/, (msg) => {
  const chatId = msg.chat.id;

  delete userCredentials[chatId];
  imageUrls.length = 0;
  bot.sendMessage(chatId, "Process canceled.");
});

server.listen(9000, () => {
  console.log("Server running!");
});
