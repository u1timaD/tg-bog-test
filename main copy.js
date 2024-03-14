import dotenv from "dotenv";
dotenv.config();
import { Bot, GrammyError, HttpError, Keyboard} from "grammy";

const BOT_KEY = process.env.BOT_API_KEY;
const bot = new Bot(BOT_KEY);

// Команда, принимает первым аргументом название команды
// Вторым асинхронную функцию с действием
// Слушаем ввод


bot.api.setMyCommands([
  {
    command: "start",
    description: "Запускает бота",
  },
  {
    command: "mood",
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

//? можно сделать клавиатуру 
//? ontime() - сворачивает клавиатуру (также можно убрать через колбек)
//?  reply_markup: {remove_keyboard: true} - совсем убирает клаву
//? resized() - подгоняет кнопки под размер содержимого
bot.command('mood', async (ctx) => {
  const moodKeyboard = new Keyboard().text('Хорошо').row().text('Норм').text('Плохо').resized()

  // ? тоже самое, только через массив значений 
  // const moodLabels = ['Хор', 'Отл', 'Пло'];
  // const rows = moodLabels.map((label) => {
  //   return [
  //     Keyboard.text(label)
  //   ]
  // })
  // const moodKeyboard2 = Keyboard.from(rows).resized()

  await ctx.reply('Как настроение?', {
    reply_markup: moodKeyboard
  })
})

bot.hears('Хорошо', async (ctx) => {
  const key2 = new Keyboard().text('точно?').text('Пизжжю').resized()
  await ctx.reply('Точно всё хорошо?',{
    reply_markup: key2
  })
})


// bot.hears('Хорошо', async (ctx) => {
//   await ctx.reply('Отлично', {
//     reply_markup: {remove_keyboard: true}
//   })
// })

// ? Можно запрашивать в консоли инфу
// bot.on('msg', async (ctx) => {
//   console.log(ctx.me)
// })

// bot.command("location", async (ctx) => {
//   await ctx.reply(`Вот тебе адрес человека: ${Person.dub.location.address}`);
// });


// //? кастомная фильтрация
// bot.on('msg').filter((ctx) => {
//   return ctx.from.id === 280181578;
// }, async (ctx) => {
//   await ctx.reply(`Привет: ${ctx.from.id}`)
// })

//? фильтрация по доке
// bot.on("message", async (ctx) => {
//   await ctx.reply(`Сообщение: `);
// });


//? слушатель конкретных сообщений [или массива], может принимать первым аргументом expReg 
bot.hears('жопа', async (ctx) => {
  await ctx.reply(`Сам ты жопа`)
})

//? Можно добавить "ответ" на сообщение добавлением 2 параметра в reply
//? Через parse_mode можно добавлять стили 
//? также можно добавлять реакции на сообщения
bot.hears('пидор', async (ctx) => {
  await ctx.react('🌚');
  await ctx.reply(`сам ты <b>${ctx.msg.text}</b>`, {
    reply_parameters: { message_id: ctx.msg.message_id},
    parse_mode: 'HTML'
  })

})

// пример проверки слов через expReg
bot.hears(/хуй/, async (ctx) => {
  await ctx.reply(`сам ты ${ctx.msg.text}`)
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
