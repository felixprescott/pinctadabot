import type { Bot } from 'grammy';
import type { BotContext } from '../types.ts';
import { listOpenVpnUsers } from '../services/openvpn.ts';

/**
 * Register the /list command.
 */
export function registerListCommand(bot: Bot<BotContext>) {
  bot.command('list', async (ctx) => {
    try {
      // Load the current OpenVPN user list.
      const users = await listOpenVpnUsers();

      // Return a friendly message when no users were found.
      if (users.length === 0) {
        await ctx.reply('no openvpn users found');
        return;
      }

      // Send one user name per line.
      await ctx.reply(users.map((user) => `<code>${user}</code>`).join('\n'), { parse_mode: 'HTML' });
    } catch (error) {
      // Log the internal error for debugging.
      console.error('failed to list openvpn users:', error);

      // Return a short user-facing error message.
      await ctx.reply('failed to get openvpn users');
    }
  });
}
