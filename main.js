import dotenv from "dotenv";
dotenv.config();
import { Bot, GrammyError, HttpError } from "grammy";

const BOT_KEY = process.env.BOT_API_KEY;
const bot = new Bot(BOT_KEY);

// Команда, принимает первым аргументом название команды
// Вторым асинхронную функцию с действием
// Слушаем ввод

const Person = {
  dub: {
    birthday: { 
      date: "01.03.1994"
    },
    location: {
      address: "Чистова 15.15 кв.62",
    },
  },
};

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запускает бота",
  },
  {
    command: "help",
    description: "Помогите",
  },
  {
    command: "birthday",
    description: "Узнать др",
  },
  {
    command: "location",
    description: "Узнать адрес",
  },
]);

// command = ответ на команды [или массив команд] вида 'start' (или любое другое значение)
bot.command("start", async (ctx) => {
  await ctx.reply(`Привет ${ctx.from.first_name}`);
});

// bot.command("location", async (ctx) => {
//   await ctx.reply(`Вот тебе адрес человека: ${Person.dub.location.address}`);
// });


// //? кастомная фильтрация
// bot.on('msg').filter((ctx) => {
//   return ctx.from.id === 280181578;
// }, async (ctx) => {
//   await ctx.reply(`Привет: ${ctx.from.id}`)
// })

// // фильтрация по доке
// bot.on("message", async (ctx) => {
//   await ctx.reply(`Сообщение: `);
// });


// слушатель конкретных сообщений [или массива], может принимать первым аргументом expReg 
bot.hears('жопа', async (ctx) => {
  await ctx.reply(`Сам ты жопа`)
})

// пример проверки слов через expReg
bot.hears(/хуй/, async (ctx) => {
  await ctx.reply(`ругаешься?`)
})





















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
