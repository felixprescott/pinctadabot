import type { Context, SessionFlavor } from 'grammy';

/**
 * Supported pending actions for multi-step bot commands.
 */
export type PendingAction = 'idle' | 'waitForAddUserName' | 'waitForGetUserName' | 'waitForDeleteUserName';

/**
 * Per-chat session data stored by grammY.
 */
export interface SessionData {
  /**
   * Current pending action for the chat.
   */
  pendingAction: PendingAction;
}

/**
 * Shared bot context with session support.
 */
export type BotContext = Context & SessionFlavor<SessionData>;
