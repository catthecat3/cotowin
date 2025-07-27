import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Telegraf } from 'telegraf';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true,
});

const User = mongoose.model('User', {
  telegramId: String,
  username: String,
  balance: Number,
});

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => {
  const { id, username } = ctx.from;
  let user = await User.findOne({ telegramId: id });
  if (!user) {
    user = await User.create({ telegramId: id, username, balance: 100 });
  }

  ctx.reply('🎰 Добро пожаловать в Cotowin Casino!', {
    reply_markup: {
      inline_keyboard: [[{
        text: 'Играть',
        web_app: { url: process.env.FRONTEND_URL }
      }]]
    }
  });
});
bot.launch();

app.get('/api/user/:telegramId', async (req, res) => {
  const user = await User.findOne({ telegramId: req.params.telegramId });
  res.json(user);
});

app.post('/api/spin', async (req, res) => {
  const { telegramId } = req.body;
  const user = await User.findOne({ telegramId });
  const win = Math.random() < 0.5 ? 10 : -10;
  user.balance += win;
  await user.save();
  res.json({ newBalance: user.balance, result: win });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Backend running on port', PORT));