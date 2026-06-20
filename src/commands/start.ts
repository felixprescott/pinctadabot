import type { Bot } from 'grammy';

export function registerStartCommand(bot: Bot) {
  bot.command('start', async (ctx) => {
    await ctx.reply(['Click.'].join('\n'));
  });
}
