import { createBot } from './src/bot.ts';
import { registerBotCommands } from './src/commands/registerBotCommands.ts';
import { setupGracefulShutdown } from './src/utils/shutdown.ts';

/**
 * Read the bot token from command line arguments.
 */
export function getBotTokenFromArgv(argv: string[]): string {
  const token = argv[2]?.trim();

  if (!token) {
    console.error('usage: node index.ts BOT_TOKEN');
    process.exit(1);
  }

  return token;
}

/**
 * Create, configure and start the bot.
 */
async function main() {
  const token = getBotTokenFromArgv(process.argv);
  const bot = createBot(token);

  // Register commands in the Telegram menu.
  await registerBotCommands(bot);

  // Handle graceful shutdown signals.
  setupGracefulShutdown(bot);

  console.log('starting bot...');
  await bot.start();
}

main().catch((error) => {
  console.error('failed to start bot:', error);
  process.exit(1);
});
