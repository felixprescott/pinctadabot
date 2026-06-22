import type { Bot, Context } from 'grammy';

/**
 * Register Telegram menu commands.
 */
export async function registerBotCommands<C extends Context>(bot: Bot<C>) {
  await bot.api.setMyCommands([
    { command: 'start', description: 'start bot' },
    { command: 'list', description: 'show openvpn users' },
    { command: 'add', description: 'add openvpn user' },
    { command: 'get', description: 'get openvpn config file' },
    { command: 'del', description: 'delete openvpn user' },
  ]);
}
