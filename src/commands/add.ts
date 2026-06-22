import { InputFile, type Bot } from 'grammy';
import type { BotContext } from '../types.ts';
import { createOpenVpnUser } from '../services/openvpn.ts';
import { isValidOpenVpnUserName } from '../utils/openvpn.ts';

/**
 * Register the /add command and related message handlers.
 */
export function registerAddCommand(bot: Bot<BotContext>) {
  bot.command('add', async (ctx) => {
    // Start the add-user flow for the current chat.
    ctx.session.pendingAction = 'waitForAddUserName';

    // Ask the user for the new OpenVPN user name.
    await ctx.reply('new user name:');
  });

  bot.on('message:text', async (ctx, next) => {
    // Skip all processing when the add-user flow is not active.
    if (ctx.session.pendingAction !== 'waitForAddUserName') {
      return next();
    }

    const text = ctx.message.text.trim();

    // Skip commands because they are handled by global middleware and command handlers.
    if (text.startsWith('/')) {
      return next();
    }

    // Reject wrong user names.
    if (!text || !isValidOpenVpnUserName(text)) {
      await ctx.reply('wrong user name');
      return;
    }

    // Stop waiting before running the creation script.
    ctx.session.pendingAction = 'idle';

    try {
      await ctx.reply(`please wait for file...`);
      const filePath = await createOpenVpnUser(text);

      // Send the generated OpenVPN config file back to the chat.
      await ctx.replyWithDocument(new InputFile(filePath, `${text}.ovpn`));
    } catch (error) {
      console.error('failed to create openvpn user:', error);
      await ctx.reply('failed to create openvpn user');
    }
  });
}
