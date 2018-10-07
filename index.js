const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const SlackBot = require("slackbots");

const reponses = [
  "É, eu vim... vim na caravana do SBT, mesmo, lá da Barra Funda.",
  "Eu sou do Cambuci.",
  "Inscrevi.",
  "Eu... eu... topo tudo por dinheiro, né?",
  "É, eu sou vendedor, né!",
  "Desenhar?",
  "Aí, eu mando elas desenhá a bola, né?",
  "Certo, mandá elas desenhá o óculos...",
  "Desenha... pa desenhá a bola!",
  "Desenha um arcoíro... um arcoíro... co... coíro, um arcoíro. Arcoíro.",
  "Pode desenhá uma frô.",
  "Aí desenha no quadro, né?",
  "Desenha um negócio de jogá bola, do Guga!",
  "Entendi, entendi. Agora entendo o raciocínio!",
  "É, por gentileza, moças, desenha aí um objeto... que vocês sabem.",
  "Não, não vou falá, né?",
  "Desenha uma boca!",
  "Duas raquete...",
  "Duas bolinha na bola!",
  "Desenha um violão...",
  "Duas bolinha...",
  "Mi ajuda, pur favor, Silvio :sweat_smile:",
  "Desenha uma calcinha!",
  "Desenha uma bola!"
];

const bot = new SlackBot({
  token: process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
  name: "moises"
});

bot.on("start", () => {
  bot.postMessageToChannel("random", reponses[Math.floor(Math.random() * reponses.length)]);
});

bot.on("message", (data) => {
  if (data.type !== "message") {
    return;
  }
  if (data.username === "moises") {
    return;
  }
  console.dir(data);

  const response = reponses[Math.floor(Math.random() * reponses.length)];

  bot.getChannelById(data.channel)
    .then((channel) => {
      console.dir(channel);
      if (!data.text.includes("moisés")) {
        return;
      }
      bot.postMessageToChannel(channel.name, response);
    }, (err) => {
      throw new Error(err);
    })
    .catch((err) => {
      console.error(err);
      postMessageToUserById(data.user, response);
    })
    .then(() => console.log("getChannelById ENDED"));
});

async function postMessageToUserById(userID, message, opts = {}) {
  const im = await bot.openIm(userID);
  const channelID = im.channel.id;
  bot.postMessage(channelID, message, opts)
};

bot.on("error", (err) => console.error(err));

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))