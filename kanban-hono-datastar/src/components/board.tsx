import { BasePage } from "./layout";
import { BarChart, PieChart, type ChartData } from "./charts";
import { CardList } from "./cards";
import { AddCardModal, EditCardModal, AddCommentModal } from "./modals";
import type { BoardDetails, User, TagItem } from "../db/api";

const PASTEL_COLORS = ["#fbbf24", "#f472b6", "#a78bfa", "#60a5fa"];

function getChartData(board: BoardDetails): ChartData[] {
  return board.lists.map((list) => ({
    label: list.title,
    value: list.cards.length,
  }));
}

export function BoardPage({
  board,
  users,
  tags,
}: {
  board: BoardDetails;
  users: User[];
  tags: TagItem[];
}) {
  return (
    <BasePage title={`${board.title} | Kanban Board`}>
      <Board board={board} users={users} tags={tags} />
    </BasePage>
  );
}

export function Board({
  board,
  users,
  tags,
}: {
  board: BoardDetails;
  users: User[];
  tags: TagItem[];
}) {
  return (
    <div id="board-app" class="min-h-screen bg-base-200">
      <div class="min-h-screen bg-base-300 text-base-content p-4 md:p-8">
        <main class="w-full p-8 space-y-10 rounded-[2.5rem] bg-base-100 dark:bg-base-200 shadow-xl">
          <div class="breadcrumbs text-sm">
            <ul>
              <li>
                <a href="/" class="link link-hover">
                  Boards
                </a>
              </li>
              <li>
                <span class="text-base-content/60">{board.title}</span>
              </li>
            </ul>
          </div>
          <BoardContent board={board} users={users} />
          <AddCardModal boardId={board.id} users={users} tags={tags} />
          <EditCardModal boardId={board.id} users={users} tags={tags} />
          <AddCommentModal boardId={board.id} users={users} />
        </main>
      </div>
    </div>
  );
}

function BoardOverview({ board }: { board: BoardDetails }) {
  const chartData = getChartData(board);

  return (
    <section class="bg-base-200 dark:bg-base-300 shadow-xl rounded-3xl p-8 space-y-6">
      <div class="space-y-3">
        <div class="badge badge-secondary badge-outline">Board overview</div>
        <h1 class="text-4xl font-black text-primary">{board.title}</h1>
        {board.description && (
          <p class="text-base text-base-content/60 max-w-2xl">
            {board.description}
          </p>
        )}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-6 max-w-[1190px] mx-auto items-start">
        <BarChart
          data={chartData}
          colors={PASTEL_COLORS}
          title="Cards per List"
        />
        <PieChart
          data={chartData}
          colors={PASTEL_COLORS}
          title="Distribution"
        />
      </div>
    </section>
  );
}

export function BoardContent({
  board,
  users,
}: {
  board: BoardDetails;
  users: User[];
}) {
  return (
    <div id="boardContent" class="space-y-8">
      <BoardOverview board={board} />
      <div class="card-actions">
        <button class="btn btn-primary" onclick="addCardModal.showModal()">
          Add Card
        </button>
      </div>
      <BoardCardsSection board={board} users={users} />
    </div>
  );
}

export function BoardCardsSection({
  board,
  users,
}: {
  board: BoardDetails;
  users: User[];
}) {
  return (
    <section id="boardCardsSection" class="flex gap-7 overflow-x-auto pb-8">
      {board.lists.length === 0 ? (
        <div class="card bg-base-200 dark:bg-base-300 shadow-xl w-full max-w-md mx-auto">
          <div class="card-body items-center text-center">
            <h2 class="card-title text-secondary">No lists yet</h2>
            <p class="text-base-content/60">
              Add a list to begin organizing work on this board.
            </p>
          </div>
        </div>
      ) : (
        board.lists.map((list) => (
          <CardList list={list} boardId={board.id} users={users} />
        ))
      )}
    </section>
  );
}
