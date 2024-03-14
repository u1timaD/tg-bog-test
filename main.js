import dotenv from "dotenv";
dotenv.config();
import { Bot, GrammyError, HttpError, Keyboard } from "grammy";

const BOT_KEY = process.env.BOT_API_KEY;
const bot = new Bot(BOT_KEY);

// Команда, принимает первым аргументом название команды
// Вторым асинхронную функцию с действием
// Слушаем ввод


// ?Тут вставить данные 

// bot.api.setMyCommands([
//   {
//     command: "start",
//     description: "Запуск бота",
//   },
//   {
//     command: "info",
//     description: "Что может бот",
//   },
// ]);

bot.command("start", async (ctx) => {
  const firstKey = new Keyboard().text("Адрес").text("ДР").resized();

  await ctx.reply(`Привет <b>${ctx.from.username}</b>. Что ты хочешь узнать?`, {
    reply_markup: firstKey,
    parse_mode: "HTML",
  });
});

bot.command("info", async (ctx) => {
  const firstKey = new Keyboard().text("Адрес").text("ДР").resized();

  await ctx.reply(
    `Привет *${ctx.from.username}*
Этот бот может не так много, лишь рассказать тебе о том где живут твои друзья, либо о том, когда у них др

Спасибо тебе друг`,
    {
      reply_markup: firstKey,
      parse_mode: "MarkdownV2",
    }
  );
});

bot.hears("Адрес", async (ctx) => {
  const addressKey = new Keyboard().resized().row();

  Friends.forEach((friend) => {
    addressKey.text(friend.family);
  });

  await ctx.reply("Чей адрес тебя интересует?", {
    reply_markup: addressKey,
  });
});

// Получения локации в зависимости от человека
const getPersonLocation = (name) => {
  const { address, floor, room, code, entry } = Friends.filter(
    (item) => item.family === `${name}`
  )[0].location;
  return `*Адрес:* ${address}
*этаж:* ${floor}
*квартира:* ${room}
*домофон:* ${code}`;
};

bot.hears(SecondName, async (ctx) => {
  const personBtn = new Keyboard().text("Назад").text("Узнать Др").resized();

  await ctx.reply(getPersonLocation(ctx.match), {
    reply_markup: personBtn,
    parse_mode: "MarkdownV2",
  });
});

bot.on("message", async (ctx) => {
  await ctx.reply("Я тебя не понимаю, пожалуйста выбери одну из команд");
});













// обработка ошибок
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
