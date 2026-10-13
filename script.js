const form = document.querySelector("#leave-note");
const nameInput = document.querySelector("#guest-name");
const messageInput = document.querySelector("#guest-message");
const notesList = document.querySelector("#notes-list");
const emptyState = document.querySelector("#empty-state");
const entryCount = document.querySelector("#entry-count");
const formStatus = document.querySelector("#form-status");
const storageKey = "jhabi-guestbook-notes-v1";

document.querySelector("#year").textContent = new Date().getFullYear();

function readNotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function renderNotes() {
  const notes = readNotes();
  notesList.replaceChildren();
  emptyState.hidden = notes.length > 0;
  entryCount.textContent = notes.length + " " + (notes.length === 1 ? "note" : "notes");

  for (const note of notes) {
    const item = document.createElement("li");
    item.className = "note-entry";

    const author = document.createElement("p");
    author.className = "note-author";
    author.textContent = note.name;

    const message = document.createElement("p");
    message.textContent = note.message;

    const date = document.createElement("time");
    date.className = "note-date";
    date.dateTime = note.createdAt;
    date.textContent = new Date(note.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    item.append(author, message, date);
    notesList.append(item);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !message) {
    formStatus.textContent = "Please add your name and a message.";
    return;
  }

  const notes = readNotes();
  notes.unshift({ name, message, createdAt: new Date().toISOString() });

  try {
    localStorage.setItem(storageKey, JSON.stringify(notes.slice(0, 30)));
    form.reset();
    formStatus.textContent = "Thanks! Your note has been added.";
    renderNotes();
  } catch {
    formStatus.textContent = "This browser could not save the note. Please try again.";
  }
});

renderNotes();
