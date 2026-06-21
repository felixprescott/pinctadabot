import { Bot, session } from 'grammy';
import { registerStartCommand } from './commands/start.ts';
import { registerListCommand } from './commands/list.ts';
import { registerAddCommand } from './commands/add.ts';
import { registerGetCommand } from './commands/get.ts';
import type { BotContext, SessionData } from './types.ts';
import { AUTHORIZED_TELEGRAM_USER_IDS } from './config/authorizedTelegramUserIds.ts';

/**
 * Create the initial session state for each chat.
 */
function initial(): SessionData {
  return {
    pendingAction: 'idle',
  };
}

/**
 * Create and configure the Telegram bot instance.
 */
export function createBot(token: string) {
  const bot = new Bot<BotContext>(token);

  // Enable per-chat session storage.
  bot.use(session({ initial }));

  // Allow only selected Telegram users to use the bot.
  bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;

    if (!userId || !AUTHORIZED_TELEGRAM_USER_IDS.has(userId)) {
      if (ctx.message?.text?.startsWith('/')) {
        await ctx.reply('not authorized');
      }

      return;
    }

    return next();
  });

  // Cancel any pending input flow when a new command is received.
  bot.on('message:text', async (ctx, next) => {
    const text = ctx.message.text.trim();

    if (ctx.session.pendingAction !== 'idle' && text.startsWith('/')) {
      ctx.session.pendingAction = 'idle';
      return next();
    }

    return next();
  });

  // Register command handlers.
  registerStartCommand(bot);
  registerListCommand(bot);
  registerAddCommand(bot);
  registerGetCommand(bot);

  // Log all unhandled bot errors.
  bot.catch((error) => {
    console.error('bot error:', error.error);
  });

  return bot;
}
