import dotenv from "dotenv";
dotenv.config();
import { Bot, GrammyError, HttpError, Keyboard } from "grammy";

const BOT_KEY = process.env.BOT_API_KEY;
const JSON_URL = process.env.JSON_URL;
const MASTER_KEY = process.env.MASTER_KEY;
const bot = new Bot(BOT_KEY);

// Команда, принимает первым аргументом название команды
// Вторым асинхронную функцию с действием
// Слушаем ввод

//? запрос данных
// const getData = () => {
//   fetch(JSON_URL, {
//     method: "GET",
//     headers: {
//       "X-Master-Key": MASTER_KEY,
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then((data) => {
//       // console.log(data.record);
//       startBot(data.record);
//     })
//     .catch((error) => {
//       console.error("There was a problem with the fetch operation:", error);
//     });
// };
// getData();

// const startBot = (data) => {
//   const Friends = data;

// ?Тут вставить данные


let searchParam = "Адрес📍";
const SecondName = Friends.map((item) => item.family);

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
  const firstKey = new Keyboard().text("Адрес📍").text("др🎂").resized();

  await ctx.reply(
    `Привет <b>${ctx.from.username}</b>.
Что ты хочешь узнать?`,
    {
      reply_markup: firstKey,
      parse_mode: "HTML",
    }
  );
});

bot.command("info", async (ctx) => {
  const firstKey = new Keyboard().text("Адрес📍").text("др🎂").resized();

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
 
bot.hears("Адрес📍", async (ctx) => {
  const addressKey = new Keyboard().resized().row();
  searchParam = "Адрес📍";

  Friends.forEach((friend) => {
    addressKey.text(friend.family);
  });

  // const word = ctx.msg.text.replace(/[^а-яА-Яa-zA-Z]/g, '').toLowerCase();

  await ctx.reply("Чей адрес тебя интересует?", {
    reply_markup: addressKey,
  });
});

bot.hears("др🎂", async (ctx) => {
  const addressKey = new Keyboard().resized().row();
  searchParam = "др🎂";

  Friends.forEach((friend) => {
    addressKey.text(friend.family);
  });

  await ctx.reply(`Чей др тебя интересует?`, {
    reply_markup: addressKey,
  });
});




//? Форматирование даты
const formateDate = (dateString) => {
  const dateParts = dateString.split(".");
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
};

//? Склоняем слово "ДЕНЬ"
const formateDayName = (number) => {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `${number} дней`;
  } else if (lastDigit === 1) {
      return `${number} день`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
      return `${number} дня`;
  } else {
      return `${number} дней`;
  }
}

//? Считаем сколько дней осталось до др
const lastDays = (dateString) => {
  const today = new Date();
  const targetDate = formateDate(dateString);
  // Создаем новый объект даты с указанным месяцем и днем текущего года
  const targetDateThisYear = new Date(
    today.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  // Рассчитываем разницу между датами
  const differenceInTime = targetDateThisYear.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return formateDayName(differenceInDays < 0 ? 365 + differenceInDays : differenceInDays);
};

//? Преобразование даты в формат {13 апреля}
const formateDay = (dateString) => {
  // Преобразование строки в объект Date
  const date = formateDate(dateString);
  const options = { day: "numeric", month: "long" };
  return date.toLocaleDateString("ru-RU", options);
};



//? Получения локации/др в зависимости от человека
const getPersonInfo = (indexPerson) => {
  if (searchParam === "Адрес📍") {
    const { address, floor, room, code, entry } = Friends.filter(
      (item) => item.family === `${indexPerson}`
    )[0].location;
    return `*Адрес:* ${address}  
*подъезд*: ${entry}  
*этаж:* ${floor}  
*квартира:* ${room}  
*домофон:* ${code}`;
  }
  if (searchParam === "др🎂") {
    const getBirthdayDates = Friends.filter(
      (item) => item.family === `${indexPerson}`
    )[0].birthday;
    const result = getBirthdayDates.map(({ name, date, wishlist }) => {
      return `*Имя:* ${name}\n*Дата рождения*: ${formateDay(date)}\n*До др осталось:* ${lastDays(date)}\n*Вишлист:* ${wishlist ?? "Пока нету"}`;
    });

    return result.join("\n\n");
  }
};

bot.hears(SecondName, async (ctx) => {
  const personBtn = new Keyboard().text("К началу🔄").resized();
  await ctx.reply(getPersonInfo(ctx.match), {
    reply_markup: personBtn,
    parse_mode: "MarkdownV2",
  });
});

bot.hears("К началу🔄", async (ctx) => {
  const firstKey = new Keyboard().text("Адрес📍").text("др🎂").resized();

  await ctx.reply(
    `Привет <b>${ctx.from.username}</b>.
  Что ты хочешь узнать?`,
    {
      reply_markup: firstKey,
      parse_mode: "HTML",
    }
  );
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
// };
