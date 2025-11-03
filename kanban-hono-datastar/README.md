# kanban-hono-datastar

A Kanban board application built with Hono, Bun, and Datastar - ported from the Go+templ implementation.

## Features

- 100% functional parity with Go version
- Identical Datastar patterns and drag/drop UX
- Same database schema (via Drizzle ORM)
- Server-Sent Events (SSE) for real-time updates
- No page reloads - all updates via Datastar

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: SQLite with Drizzle ORM
- **Frontend**: Datastar with vanilla JavaScript
- **Styling**: Tailwind CSS + DaisyUI

## Setup

1. Install dependencies:

```bash
bun install
```

2. Run database migrations:

```bash
bun run db:migrate
```

3. Seed the database:

```bash
bun run db:seed
```

4. Build CSS:

```bash
bun run css:build
```

5. Start the development server:

```bash
bun run dev
```

The app will be available at `http://localhost:3000`

## Routes

Exact match with Go version:

- `GET /` - Home page with boards list
- `POST /board` - Create new board
- `GET /board/:boardId` - View board
- `POST /board/:boardId/card` - Create card
- `POST /board/:boardId/card/:cardId` - Update card
- `DELETE /board/:boardId/card/:cardId` - Delete card
- `POST /board/:boardId/card/:cardId/comment` - Add comment
- `PUT /board/:boardId/card/:cardId/list` - Move card to different list
- `PUT /board/:boardId/list/:listId/positions` - Reorder cards in list

## Development

- `bun run dev` - Start development server with hot reload
- `bun run css:watch` - Watch and rebuild CSS
- `bun run db:generate` - Generate new migration
- `bun run db:migrate` - Run migrations
- `bun run db:seed` - Seed database

## Production

```bash
bun run build
bun run start
```
