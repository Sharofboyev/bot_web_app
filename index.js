const { Telegraf } = require("telegraf");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_TOKEN);
const fs = require("fs");

bot.start((ctx) => {
  return ctx.reply("Hello", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Test",
            web_app: {
              url: "https://sharofboyev.github.io/bot_web_app/index.html",
            },
          },
        ],
      ],
    },
  });
});

bot.on("web_app_data", (ctx) => {
  fs.writeFileSync("data.json", JSON.stringify(ctx.webAppData, undefined, 2));
});

bot.launch();
