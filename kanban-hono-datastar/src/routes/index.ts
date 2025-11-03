import { Hono, type Context } from "hono";
import { serveStatic } from "hono/bun";
import { IndexPage } from "../components/index";
import { BoardPage, Board, BoardContent } from "../components/board";
import { sseRedirect, ssePatch } from "../lib/datastar";
import { renderToString } from "hono/jsx/dom/server";
import {
  getBoards,
  getBoard,
  getUsers,
  getTags,
  createBoard as dbCreateBoard,
  createCard as dbCreateCard,
  updateCard as dbUpdateCard,
  deleteCard as dbDeleteCard,
  addComment as dbAddComment,
  updateCardPositions as dbUpdateCardPositions,
} from "../db/api";
import { streamSSE } from "hono/streaming";

const app = new Hono();

app.get("/static/*", async (c) => {
  const path = c.req.path.replace("/static/", "");
  const filePath = `./static/${path}`;
  const file = Bun.file(filePath);

  if (await file.exists()) {
    // Get the proper content type
    const ext = path.split(".").pop();
    const contentTypes: Record<string, string> = {
      css: "text/css",
      js: "application/javascript",
      png: "image/png",
      jpg: "image/jpeg",
      svg: "image/svg+xml",
      woff: "font/woff",
      woff2: "font/woff2",
    };

    return new Response(file, {
      headers: {
        "Content-Type": contentTypes[ext || ""] || "application/octet-stream",
      },
    });
  }

  return c.notFound();
});

// Hot reload endpoint for development
app.get("/hotreload", (c) => {
  return streamSSE(c, async (stream) => {
    await stream.writeSSE({
      event: "datastar-patch-elements",
      data: `selector body\nmode append\nelements <script>window.location.reload()</script>`,
    });
  });
});

app.get("/", async (c) => {
  const boards = await getBoards();
  const html = renderToString(IndexPage({ boards }));
  return c.html(html);
});

app.post("/board", async (c) => {
  const formData = await c.req.formData();
  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string)?.trim() || "";

  const board = await dbCreateBoard({ title, description });

  return streamSSE(c, async (stream) => {
    await stream.writeSSE(sseRedirect(`/board/${board.id}`));
  });
});

app.get("/board/:boardId", async (c) => {
  const boardId = c.req.param("boardId");
  const board = await getBoard(boardId);

  if (!board) {
    return c.notFound();
  }

  const users = await getUsers();
  const tags = await getTags();

  // Check if this is a Datastar request (e.g., from @get() in drop event)
  const isDatastarRequest = c.req.header("Datastar-Request") === "true";

  if (isDatastarRequest) {
    // Return SSE patch for body morphing
    const html = renderToString(Board({ board, users, tags }));
    return streamSSE(c, async (stream) => {
      await stream.writeSSE(ssePatch("#board-app", html));
    });
  }

  // Return full HTML page for regular navigation
  const html = renderToString(BoardPage({ board, users, tags }));
  return c.html(html);
});

app.post("/board/:boardId/card", async (c) => {
  const boardId = c.req.param("boardId");
  const board = await getBoard(boardId);

  if (!board) {
    return c.notFound();
  }

  const formData = await c.req.formData();

  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const assigneeId = (formData.get("assigneeId") as string)?.trim() || null;
  const tagIds = formData.getAll("tagIds") as string[];

  await dbCreateCard({
    boardId,
    title,
    description,
    assigneeId,
    tagIds,
  });

  // Re-fetch board to get the newly created card
  const updatedBoard = (await getBoard(boardId))!;
  const users = await getUsers();
  const tags = await getTags();
  const html = renderToString(Board({ board: updatedBoard, users, tags }));

  return streamSSE(c, async (stream) => {
    await stream.writeSSE(ssePatch("#board-app", html));
  });
});

app.post("/board/:boardId/card/:cardId", async (c) => {
  const boardId = c.req.param("boardId");
  const cardId = c.req.param("cardId");
  const board = await getBoard(boardId);

  if (!board) {
    return c.notFound();
  }

  const formData = await c.req.formData();

  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const assigneeId = (formData.get("assigneeId") as string)?.trim() || null;
  const tagIds = formData.getAll("tagIds") as string[];

  await dbUpdateCard({
    cardId,
    title,
    description,
    assigneeId,
    tagIds,
  });

  // Re-fetch board to get the updated card
  const updatedBoard = (await getBoard(boardId))!;
  const users = await getUsers();
  const tags = await getTags();
  const html = renderToString(Board({ board: updatedBoard, users, tags }));

  return streamSSE(c, async (stream) => {
    await stream.writeSSE(ssePatch("#board-app", html));
  });
});

app.delete("/board/:boardId/card/:cardId", async (c) => {
  const boardId = c.req.param("boardId");
  const cardId = c.req.param("cardId");
  const board = await getBoard(boardId);

  if (!board) {
    return c.notFound();
  }

  await dbDeleteCard(cardId);

  // Re-fetch board to get the updated state (card removed)
  const updatedBoard = (await getBoard(boardId))!;
  const users = await getUsers();
  const tags = await getTags();
  const html = renderToString(Board({ board: updatedBoard, users, tags }));

  return streamSSE(c, async (stream) => {
    await stream.writeSSE(ssePatch("#board-app", html));
  });
});

app.post("/board/:boardId/card/:cardId/comment", async (c) => {
  const boardId = c.req.param("boardId");
  const cardId = c.req.param("cardId");
  const board = await getBoard(boardId);

  if (!board) {
    return c.notFound();
  }

  const formData = await c.req.formData();

  const userId = (formData.get("userId") as string).trim();
  const text = (formData.get("text") as string).trim();

  await dbAddComment({
    cardId,
    userId,
    text,
  });

  // Re-fetch board to get the new comment
  const updatedBoard = (await getBoard(boardId))!;
  const users = await getUsers();
  const tags = await getTags();
  const html = renderToString(Board({ board: updatedBoard, users, tags }));

  return streamSSE(c, async (stream) => {
    await stream.writeSSE(ssePatch("#board-app", html));
  });
});

// Single endpoint to handle drag/drop: move card to new list and reorder
app.put("/board/:boardId/card/:cardId/position", async (c) => {
  const boardId = c.req.param("boardId");
  const cardId = c.req.param("cardId");
  const board = await getBoard(boardId);
  console.log(board);

  if (!board) {
    return c.notFound();
  }

  const body = await c.req.json();
  const listId = body.listId.trim();
  const cardIds = body.cardIds as string[];

  // Update all card positions and list in one atomic operation
  const updates = cardIds.map((id, index) => ({
    cardId: id,
    listId: listId,
    position: index,
  }));

  await dbUpdateCardPositions(updates);

  // Return updated UI
  const updatedBoard = (await getBoard(boardId))!;
  const users = await getUsers();
  const tags = await getTags();
  console.log(updatedBoard);
  const html = renderToString(Board({ board: updatedBoard, users, tags }));

  return streamSSE(c, async (stream) => {
    console.log(html);
    await stream.writeSSE(ssePatch("#board-app", html));
  });
});

export default app;
