const express = require("express");
const OpenAI = require("openai");
const bodyParser = require("body-parser");
const cors = require('cors')
require("dotenv/config")
const {Client,IntentsBitField} = require("discord.js")

const app = express();
const port = 3000;
const openai = new OpenAI();

app.use(bodyParser.json());
app.use(cors());

app.post("/ask", async (req, res) => {

  const prompt = req.body.prompt
  console.log(prompt);
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },

      { role: "user", content: prompt },
    ],
    model: "gpt-3.5-turbo",
  });

  const systemResponse = {
    status : "success",
    message : completion.choices[0].message.content
  }
  res.send(systemResponse)
  
  
});


const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

bot.on('ready',()=>{
  console.log("I am Ready!");

})
bot.on('messageCreate', async (message)=>{

  if(message.author.bot) return;
  if(!message.content.startsWith("/")) return;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },

      { role: "user", content: message.content },
    ],
    model: "gpt-3.5-turbo",
  });

  await message.channel.sendTyping();
  message.reply(completion.choices[0].message.content)

})

bot.login(process.env.TOKEN)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
