import { createBot } from './src/bot.ts';
import { setupGracefulShutdown } from './src/utils/shutdown.ts';

export function getBotTokenFromArgv(argv: string[]): string {
  const token = argv[2]?.trim();

  if (!token) {
    console.error('Usage: node index.js BOT_TOKEN');
    process.exit(1);
  }

  return token;
}

async function main() {
  const token = getBotTokenFromArgv(process.argv);
  const bot = createBot(token);

  setupGracefulShutdown(bot);

  console.log('Starting bot...');
  await bot.start();
}

main().catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
