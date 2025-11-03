import type { BoardList, BoardCard, User } from "../db/api";

export function CardList({
  list,
  boardId,
  users,
}: {
  list: BoardList;
  boardId: string;
  users: User[];
}) {
  const dropHandler = `evt.preventDefault(); evt.currentTarget.classList.remove('ring-4', 'ring-primary', 'ring-offset-2', 'bg-primary/5', 'scale-[1.02]'); const cardId = evt.dataTransfer.getData('cardId'); const sourceListId = evt.dataTransfer.getData('listId'); $listId = '${list.id}'; const dropY = evt.clientY; const cardsInList = evt.currentTarget.querySelectorAll('[role="listitem"]'); let insertPosition = cardsInList.length; for (let i = 0; i < cardsInList.length; i++) { const rect = cardsInList[i].getBoundingClientRect(); const cardMiddle = rect.top + rect.height / 2; if (dropY < cardMiddle) { insertPosition = i; break; } } const allCardIds = Array.from(cardsInList).filter(card => card.dataset.cardId !== cardId).map(card => card.dataset.cardId); allCardIds.splice(insertPosition, 0, cardId); $cardIds = allCardIds; @put('/board/` + boardId + `/card/' + cardId + '/position')`;

  return (
    <article class="card bg-base-200 dark:bg-base-300 min-w-[20rem] shadow-xl">
      <div class="card-body gap-4" data-signals="{listId: '', cardIds: []}">
        <header class="flex items-center justify-between">
          <h2 class="card-title text-base-content">{list.title}</h2>
          <div class="badge badge-primary badge-outline badge-lg shadow">
            {list.cards.length} cards
          </div>
        </header>
        <div
          class="card-list min-h-[200px] transition-all duration-200 rounded-lg space-y-3"
          data-list-id={list.id}
          data-on:dragover="evt.preventDefault(); evt.currentTarget.classList.add('ring-4', 'ring-primary', 'cursor-grabbing', 'ring-offset-2', 'bg-primary/5', 'scale-[1.02]')"
          data-on:dragleave="evt.currentTarget.classList.remove('ring-4', 'ring-primary', 'ring-offset-2', 'bg-primary/5', 'scale-[1.02]')"
          data-on:drop={dropHandler}
        >
          {list.cards.length === 0 ? (
            <div class="empty-placeholder alert alert-info text-sm">
              <span>No cards yet</span>
            </div>
          ) : (
            list.cards.map((card) => (
              <Card card={card} boardId={boardId} listId={list.id} />
            ))
          )}
        </div>
      </div>
    </article>
  );
}

export function Card({
  card,
  boardId,
  listId,
}: {
  card: BoardCard;
  boardId: string;
  listId: string;
}) {
  return (
    <article
      class="card bg-base-100 dark:bg-neutral shadow-lg transition-all duration-300 ease-in-out cursor-grab active:cursor-grabbing"
      id={card.id}
      data-card-id={card.id}
      role="listitem"
      draggable="true"
      data-on:dragstart={`evt.dataTransfer.effectAllowed = 'move'; evt.dataTransfer.setData('cardId', '${card.id}'); evt.dataTransfer.setData('listId', '${listId}'); evt.target.classList.add('opacity-50')`}
      data-on:dragend="evt.target.classList.remove('opacity-50')"
    >
      <div class="card-body gap-3 p-4">
        <div class="flex items-start justify-between gap-2">
          <h3 class="card-title text-lg text-base-content">{card.title}</h3>
          {card.completed && (
            <span class="badge badge-success badge-outline">Done</span>
          )}
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle"
            data-on:click={`$cardId = '${card.id}'; editCardModal.showModal()`}
            aria-label="Edit card"
          >
            <EditPencil />
          </button>
        </div>
        {card.assigneeId && (
          <div class="badge badge-outline badge-secondary badge-sm">
            Assigned to user {card.assigneeId}
          </div>
        )}
        {card.description && (
          <p class="text-sm text-base-content/70 bg-base-200 dark:bg-base-100 rounded-xl px-3 py-2">
            {card.description}
          </p>
        )}
        {card.tags && card.tags.length > 0 && (
          <div class="flex flex-wrap gap-2.5 rounded-xl px-3 py-2 bg-base-200 dark:bg-base-100">
            {card.tags.map((tag) => (
              <span
                class="badge border-0 shadow font-semibold text-white"
                style={`background-color: ${tag.color};`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div class="rounded-2xl bg-base-200 dark:bg-base-100 p-3 space-y-2 shadow-inner">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold text-base-content/50">Comments</p>
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-circle"
              data-on:click={`$cardId = '${card.id}'; addCommentModal.showModal()`}
              aria-label="Add comment"
            >
              +
            </button>
          </div>
          {card.comments.length === 0 ? (
            <p class="text-sm text-base-content/70">No comments yet</p>
          ) : (
            <ul class="space-y-1 text-sm text-base-content/70">
              {card.comments.map((comment) => (
                <li>
                  <span class="font-semibold text-base-content">
                    User {comment.userId}:
                  </span>{" "}
                  {comment.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

function EditPencil() {
  return (
    <svg
      class="cursor-pointer"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#cccccc"
        d="M13.2916 0.0012207L17.9987 4.70833L15 7.707L10.2929 2.99993L13.2916 0.0012207ZM13.2916 1.41543L11.7071 2.99993L15 6.29282L16.5845 4.70833L13.2916 1.41543ZM8.879 4.41382L13.5861 9.1209L4.70711 17.9999H0V13.2928L8.879 4.41382ZM1 13.707V16.9999H4.29289L12.1719 9.1209L8.879 5.82804L1 13.707Z"
      />
    </svg>
  );
}
