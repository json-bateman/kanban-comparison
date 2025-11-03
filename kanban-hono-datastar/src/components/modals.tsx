import type { User, TagItem } from "../db/api";

export function AddCardModal({
  boardId,
  users,
  tags,
}: {
  boardId: string;
  users: User[];
  tags: TagItem[];
}) {
  return (
    <>
      <dialog id="addCardModal" class="modal">
        <div class="modal-box bg-base-200 dark:bg-base-300">
          <button
            type="button"
            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onclick="addCardModal.close()"
          >
            ✕
          </button>
          <form
            method="post"
            data-on:submit={`@post('/board/${boardId}/card', {contentType: 'form'}); addCardModal.close()`}
          >
            <h3 class="font-bold text-lg mb-4">Add New Card</h3>
            <div class="form-control w-full mb-4">
              <label class="label" for="card-title">
                <span class="label-text">Title</span>
              </label>
              <input
                id="card-title"
                name="title"
                type="text"
                class="input input-bordered w-full"
                placeholder="Enter card title"
                required
              />
            </div>
            <div class="form-control w-full mb-4">
              <label class="label" for="card-description">
                <span class="label-text">Description</span>
              </label>
              <textarea
                id="card-description"
                name="description"
                class="textarea textarea-bordered h-24 w-full"
                placeholder="Enter card description (optional)"
              />
            </div>
            <div class="form-control w-full mb-4">
              <label class="label" for="card-assignee">
                <span class="label-text">Assignee</span>
              </label>
              <select
                id="card-assignee"
                name="assigneeId"
                class="select select-bordered w-full"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div class="form-control w-full mb-4">
              <div class="label">
                <span class="label-text">Tags</span>
              </div>
              <div class="flex flex-wrap gap-2 p-4 border border-base-300 rounded-lg">
                {tags.map((tag) => (
                  <label
                    class="tag-checkbox-label badge border-2 font-semibold cursor-pointer transition-all hover:scale-105"
                    style={`--tag-color: ${tag.color}; color: ${tag.color}; border-color: ${tag.color};`}
                  >
                    <input
                      type="checkbox"
                      name="tagIds"
                      value={tag.id}
                      class="hidden"
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div class="modal-action">
              <button
                type="button"
                class="btn btn-ghost"
                onclick="addCardModal.close()"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Add Card
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tag-checkbox-label:has(input:checked) {
          background-color: var(--tag-color) !important;
          color: white !important;
        }
      `,
        }}
      />
    </>
  );
}

export function EditCardModal({
  boardId,
  users,
  tags,
}: {
  boardId: string;
  users: User[];
  tags: TagItem[];
}) {
  return (
    <dialog id="editCardModal" class="modal">
      <div class="modal-box bg-base-200 dark:bg-base-300">
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onclick="editCardModal.close()"
        >
          ✕
        </button>
        <h3 class="font-bold text-lg mb-4">Edit Card</h3>
        <form
          method="post"
          data-on:submit={`@post('/board/${boardId}/card/' + $cardId, {contentType: 'form'}); editCardModal.close()`}
        >
          <div class="form-control w-full mb-4">
            <label class="label" for="edit-card-title">
              <span class="label-text">Title</span>
            </label>
            <input
              id="edit-card-title"
              name="title"
              type="text"
              class="input input-bordered w-full"
              placeholder="Enter card title"
              data-bind="editTitle"
              required
            />
          </div>
          <div class="form-control w-full mb-4">
            <label class="label" for="edit-card-description">
              <span class="label-text">Description</span>
            </label>
            <textarea
              id="edit-card-description"
              name="description"
              class="textarea textarea-bordered h-24 w-full"
              placeholder="Enter card description (optional)"
              data-bind="editDescription"
            />
          </div>
          <div class="form-control w-full mb-4">
            <label class="label" for="edit-card-assignee">
              <span class="label-text">Assignee</span>
            </label>
            <select
              id="edit-card-assignee"
              name="assigneeId"
              class="select select-bordered w-full"
              data-bind="editAssigneeId"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div class="form-control w-full mb-4">
            <div class="label">
              <span class="label-text">Tags</span>
            </div>
            <div class="flex flex-wrap gap-2 p-4 border border-base-300 rounded-lg">
              {tags.map((tag) => (
                <label
                  class="tag-checkbox-label badge border-2 font-semibold cursor-pointer transition-all hover:scale-105"
                  style={`--tag-color: ${tag.color}; color: ${tag.color}; border-color: ${tag.color};`}
                >
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={tag.id}
                    class="hidden"
                  />
                  <span>{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div class="modal-action justify-between">
            <button
              type="button"
              class="btn btn-error"
              data-on:click={`if(confirm('Are you sure you want to delete this card?')) { @delete('/board/${boardId}/card/' + $cardId); editCardModal.close() }`}
            >
              Delete Card
            </button>
            <div class="flex gap-2">
              <button
                type="button"
                class="btn btn-ghost"
                onclick="editCardModal.close()"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export function AddCommentModal({
  boardId,
  users,
}: {
  boardId: string;
  users: User[];
}) {
  return (
    <dialog id="addCommentModal" class="modal">
      <div class="modal-box bg-base-200 dark:bg-base-300 max-w-2xl">
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onclick="addCommentModal.close()"
        >
          ✕
        </button>
        <h3 class="font-bold text-lg mb-4">Add Comment</h3>
        <form
          method="post"
          data-on:submit={`@post('/board/${boardId}/card/' + $cardId + '/comment', {contentType: 'form'}); addCommentModal.close()`}
        >
          <div class="form-control w-full mb-4">
            <label class="label" for="comment-user">
              <span class="label-text">Comment as</span>
            </label>
            <select
              id="comment-user"
              name="userId"
              class="select select-bordered w-full"
              required
            >
              {users.map((user) => (
                <option value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div class="form-control w-full mb-4">
            <label class="label" for="comment-text">
              <span class="label-text">Your comment</span>
            </label>
            <textarea
              id="comment-text"
              name="text"
              class="textarea textarea-bordered h-24 w-full"
              placeholder="Write your comment..."
              required
            />
          </div>
          <div class="modal-action">
            <button
              type="button"
              class="btn btn-ghost"
              onclick="addCommentModal.close()"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Add Comment
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
