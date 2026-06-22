import type { Bot } from 'grammy';
import type { BotContext } from '../types.ts';

/**
 * Register the /start command.
 */
export function registerStartCommand(bot: Bot<BotContext>) {
  bot.command('start', async (ctx) => {
    await ctx.reply(
      [
        '/list - show openvpn users',
        '/add - add openvpn user',
        '/get - get openvpn config file',
        '/del - delete openvpn user',
      ].join('\n'),
    );
  });
}
