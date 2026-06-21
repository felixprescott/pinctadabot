import type { Bot, Context } from 'grammy';

/**
 * Register process signal handlers for graceful bot shutdown.
 */
export function setupGracefulShutdown<C extends Context>(bot: Bot<C>) {
  const stop = async (signal: string) => {
    console.log(`received ${signal}, stopping bot...`);
    await bot.stop();
    process.exit(0);
  };

  process.once('SIGINT', () => void stop('SIGINT'));
  process.once('SIGTERM', () => void stop('SIGTERM'));
}
