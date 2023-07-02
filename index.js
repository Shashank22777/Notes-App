// Array to store notes
let notes = [];

// Get elements
const addNoteButton = document.getElementById("addNoteButton");
const notePopup = document.getElementById("notePopup");
const noteForm = document.getElementById("noteForm");
const noteTitleInput = document.getElementById("noteTitle");
const noteTaglineInput = document.getElementById("noteTagline");
const noteContentInput = document.getElementById("noteContent");
const notesGrid = document.getElementById("notesGrid");
const pagination = document.getElementById("pagination");

// Open the note popup when the add note button is clicked
addNoteButton.addEventListener("click", function () {
  noteForm.reset();
  noteForm.dataset.mode = "add";
  notePopup.style.display = "block";
});

// Close the note popup
function closeNotePopup() {
  notePopup.style.display = "none";
}
// Add event listener for form submission
noteForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the note input values
  const noteTitle = noteTitleInput.value.trim();
  const noteTagline = noteTaglineInput.value.trim();
  const noteContent = noteContentInput.value.trim();

  // Add or update the note
  if (noteTitle !== "" && noteContent !== "") {
    const note = {
      title: noteTitle,
      tagline: noteTagline,
      content: noteContent
    };

    if (noteForm.dataset.mode === "add") {
      notes.push(note);
    } else if (noteForm.dataset.mode === "edit") {
      const noteIndex = parseInt(noteForm.dataset.index);
      notes[noteIndex] = note;
    }

    // Close the note popup
    closeNotePopup();

    // Update the notes grid and pagination
    displayNotes();
  }
});

// Function to delete a note
function deleteNote(index) {
  notes.splice(index, 1);
  displayNotes();
}

// Function to edit a note
// Function to create a note element
function createNoteElement(note, index) {
  const noteElement = document.createElement("div");
  noteElement.classList.add("note");
  noteElement.innerHTML = `
    <h2>${note.title}</h2>
    <h4>${note.tagline}</h4>
    <p>${note.content}</p>
    <div class="note-actions">
      <button class="edit-button">Edit</button>
      <button class="delete-button">Delete</button>
    </div>
  `;

  const editButton = noteElement.querySelector(".edit-button");
  editButton.addEventListener("click", function () {
    editNote(index);
  });

  const deleteButton = noteElement.querySelector(".delete-button");
  deleteButton.addEventListener("click", function () {
    deleteNote(index);
  });

  return noteElement;
}

// Function to edit a note
function editNote(index) {
  const note = notes[index];
  noteForm.dataset.mode = "edit";
  noteForm.dataset.index = index;
  noteTitleInput.value = note.title;
  noteTaglineInput.value = note.tagline;
  noteContentInput.value = note.content;
  notePopup.style.display = "block";
}

// Function to display notes
function displayNotes(page = 1) {
  // Clear the notes grid and pagination
  notesGrid.innerHTML = "";
  pagination.innerHTML = "";

  // Determine the starting and ending indices based on the current page
  const notesPerPage = 6;
  const startIndex = (page - 1) * notesPerPage;
  const endIndex = Math.min(startIndex + notesPerPage, notes.length);

  // Get the notes to display on the current page
  const currentNotes = notes.slice(startIndex, endIndex);

  // Iterate over the current notes and create note elements
  currentNotes.forEach(function (note, index) {
    const noteElement = createNoteElement(note, startIndex + index);
    notesGrid.appendChild(noteElement);
  });

  // Calculate the total number of pages
  const totalPages = Math.ceil(notes.length / notesPerPage);

  // Generate pagination links
  for (let i = 1; i <= totalPages; i++) {
    const paginationLink = document.createElement("span");
    paginationLink.classList.add("pagination-link");
    paginationLink.textContent = i;

    // Highlight the current page
    if (i === page) {
      paginationLink.classList.add("active");
    }

    // Add event listener for pagination link
    paginationLink.addEventListener("click", function () {
      displayNotes(i);
    });

    pagination.appendChild(paginationLink);
  }
}
