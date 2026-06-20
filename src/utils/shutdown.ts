import type { Bot } from 'grammy';

export function setupGracefulShutdown(bot: Bot) {
  const stop = async (signal: string) => {
    console.log(`Received ${signal}, stopping bot...`);
    await bot.stop();
    process.exit(0);
  };

  process.once('SIGINT', () => void stop('SIGINT'));
  process.once('SIGTERM', () => void stop('SIGTERM'));
}
