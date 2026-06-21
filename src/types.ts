import type { Context, SessionFlavor } from 'grammy';

export type PendingAction = 'idle' | 'waitForAddUserName' | 'waitForGetUserName';

export interface SessionData {
  pendingAction: PendingAction;
}

export type BotContext = Context & SessionFlavor<SessionData>;
