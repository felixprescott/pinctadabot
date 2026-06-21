import { InputFile, type Bot } from 'grammy';
import type { BotContext } from '../types.ts';
import { getOpenVpnUserConfigPath } from '../services/openvpn.ts';
import { isValidOpenVpnUserName } from '../utils/openvpn.ts';

/**
 * Register the /get command and related message handlers.
 */
export function registerGetCommand(bot: Bot<BotContext>) {
  bot.command('get', async (ctx) => {
    // Start the get-user-config flow for the current chat.
    ctx.session.pendingAction = 'waitForGetUserName';

    // Ask the user for the existing OpenVPN user name.
    await ctx.reply('type user name:');
  });

  bot.on('message:text', async (ctx, next) => {
    // Skip all processing when the get-user flow is not active.
    if (ctx.session.pendingAction !== 'waitForGetUserName') {
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

    // Stop waiting before loading the config file.
    ctx.session.pendingAction = 'idle';

    try {
      const filePath = await getOpenVpnUserConfigPath(text);

      // Send the existing OpenVPN config file back to the chat.
      await ctx.replyWithDocument(new InputFile(filePath, `${text}.ovpn`));
    } catch (error) {
      console.error('failed to get openvpn config file:', error);
      await ctx.reply('failed to get openvpn config file');
    }
  });
}
