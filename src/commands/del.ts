import type { Bot } from 'grammy';
import type { BotContext } from '../types.ts';
import { deleteOpenVpnUser } from '../services/openvpn.ts';

/**
 * Register the /del command and related message handlers.
 */
export function registerDeleteCommand(bot: Bot<BotContext>) {
  bot.command('del', async (ctx) => {
    // Start the delete-user flow for the current chat.
    ctx.session.pendingAction = 'waitForDeleteUserName';

    // Ask the user for the existing OpenVPN user name.
    await ctx.reply('type user name:');
  });

  bot.on('message:text', async (ctx, next) => {
    // Skip all processing when the delete-user flow is not active.
    if (ctx.session.pendingAction !== 'waitForDeleteUserName') {
      return next();
    }

    const text = ctx.message.text.trim();

    // Skip commands because they are handled by global middleware and command handlers.
    if (text.startsWith('/')) {
      return next();
    }

    // Reject empty user names.
    if (!text) {
      await ctx.reply('wrong user name');
      return;
    }

    // Stop waiting before running the deletion script.
    ctx.session.pendingAction = 'idle';

    try {
      await deleteOpenVpnUser(text);
      await ctx.reply(`user "${text}" deleted`);
    } catch (error) {
      console.error('failed to delete openvpn user:', error);
      await ctx.reply('failed to delete openvpn user');
    }
  });
}
