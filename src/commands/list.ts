import type { Bot } from 'grammy';
import { listOpenVpnUsers } from '../services/openvpn.ts';

export function registerListCommand(bot: Bot) {
  bot.command('list', async (ctx) => {
    try {
      const users = await listOpenVpnUsers();

      if (users.length === 0) {
        await ctx.reply('Пользователи OpenVPN не найдены.');
        return;
      }

      await ctx.reply(['Пользователи OpenVPN:', ...users.map((user) => `- ${user}`)].join('\n'));
    } catch (error) {
      console.error('Failed to list OpenVPN users:', error);
      await ctx.reply('Не удалось получить список пользователей OpenVPN.');
    }
  });
}
