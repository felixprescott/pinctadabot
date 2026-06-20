import { Bot } from 'grammy';
import { registerStartCommand } from './commands/start.ts';
import { registerListCommand } from './commands/list.ts';

export function createBot(token: string) {
  const bot = new Bot(token);

  registerStartCommand(bot);
  registerListCommand(bot);

  bot.on('message:text', async (/*ctx*/) => {
    // await ctx.reply('Команда не распознана. Используй /help');
  });

  bot.catch((error) => {
    console.error('Bot error:', error.error);
  });

  return bot;
}
