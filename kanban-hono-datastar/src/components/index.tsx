import { BasePage } from "./layout";
import type { BoardSummary } from "../db/api";

export function IndexPage({ boards }: { boards: BoardSummary[] }) {
  return (
    <BasePage title="Kanban Boards">
      <div id="landingPage" style="display: contents">
        <div class="min-h-screen bg-base-200">
          <main
            id="index"
            class="w-full max-w-4xl mx-auto p-8 space-y-10 rounded-[2.5rem] bg-base-100 dark:bg-base-200 shadow-xl"
          >
            <header class="text-center space-y-3">
              <p class="text-sm uppercase tracking-wide text-secondary">
                Your workspace
              </p>
              <h1 class="text-4xl font-black text-primary">Boards</h1>
              <p class="text-base text-base-content/60">
                Choose to jump into your Kanban flow.
              </p>
            </header>
            <div class="flex justify-end">
              <button
                class="btn btn-primary"
                onclick="addBoardModal.showModal()"
              >
                Add Board
              </button>
            </div>
            <BoardsList boards={boards} />
            <AddBoardModal />
          </main>
        </div>
      </div>
    </BasePage>
  );
}

function BoardsList({ boards }: { boards: BoardSummary[] }) {
  return (
    <section id="boards-list" class="grid gap-8 md:grid-cols-2">
      {boards.length === 0 ? (
        <div class="card bg-base-200 dark:bg-base-300 shadow-xl">
          <div class="card-body items-center text-center">
            <h2 class="card-title text-secondary">No boards yet</h2>
            <p class="text-base-content/60">
              Create your first board to get started.
            </p>
          </div>
        </div>
      ) : (
        boards.map((board) => <BoardCard board={board} />)
      )}
    </section>
  );
}

function BoardCard({ board }: { board: BoardSummary }) {
  return (
    <a
      href={`/board/${board.id}`}
      class="card bg-base-200 dark:bg-base-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
    >
      <div class="card-body">
        <h2 class="card-title text-primary">{board.title}</h2>
        {board.description ? (
          <p class="text-sm text-base-content/60">{board.description}</p>
        ) : (
          <p class="badge badge-secondary badge-outline w-fit shadow">
            No description
          </p>
        )}
        <div class="card-actions justify-end">
          <span class="btn btn-secondary btn-sm shadow-lg">Open board</span>
        </div>
      </div>
    </a>
  );
}

function AddBoardModal() {
  return (
    <dialog id="addBoardModal" class="modal">
      <div class="modal-box bg-base-200 dark:bg-base-300">
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onclick="addBoardModal.close()"
        >
          ✕
        </button>
        <form
          method="post"
          data-on:submit="@post('/board', {contentType: 'form'}); addBoardModal.close();"
        >
          <h3 class="font-bold text-lg mb-4">Add New Board</h3>
          <div class="form-control w-full mb-4">
            <label class="label" for="board-title">
              <span class="label-text">Title</span>
            </label>
            <input
              id="board-title"
              name="title"
              type="text"
              class="input input-bordered w-full"
              placeholder="Enter board title"
              required
              data-bind="title"
            />
          </div>
          <div class="form-control w-full mb-4">
            <label class="label" for="board-description">
              <span class="label-text">Description</span>
            </label>
            <textarea
              id="board-description"
              name="description"
              class="textarea textarea-bordered h-24 w-full"
              placeholder="Enter board description (optional)"
              data-bind="description"
            />
          </div>
          <div class="modal-action">
            <button
              type="button"
              class="btn btn-ghost"
              onclick="addBoardModal.close()"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Add Board
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
