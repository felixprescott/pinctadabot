# OpenVPN Telegram Bot

Telegram bot for managing OpenVPN users with existing shell scripts.

## Features

- list OpenVPN users
- add a new OpenVPN user
- get an existing `.ovpn` file
- delete an OpenVPN user
- restrict access by Telegram user id allowlist

## Commands

- `/start` - show available commands
- `/list` - show OpenVPN users
- `/add` - create a new OpenVPN user
- `/get` - get an existing OpenVPN config file
- `/del` - delete an OpenVPN user

## Project structure

```text
src/
  commands/
  config/
  services/
  utils/
scripts/
  create.sh
  delete.sh
```

## Requirements

- Node.js
- Telegram bot token
- OpenVPN management scripts
- access to the OpenVPN files directory

## Configuration

Update these values before running the bot:

- Telegram bot token
- authorized Telegram user ids
- paths to OpenVPN scripts and files

## Run

Install dependencies:

```bash
npm install
```

Start the bot:

```bash
npm run start -- <BOT_TOKEN>
```

## Notes

- only authorized Telegram users can use the bot
- the bot uses existing shell scripts for user management
- generated `.ovpn` files are sent back to Telegram as documents
