document.addEventListener('DOMContentLoaded', () => {
    const noteTitle = document.querySelector('.note-title');
    const noteText = document.querySelector('.note-textarea');
    const saveNoteBtn = document.querySelector('.save-note');
    const newNoteBtn = document.querySelector('.new-note');
    const noteList = document.querySelector('.list-container');
  
    // Function to fetch all notes from the server
    const fetchNotes = () => {
      fetch('/api/notes')
        .then(response => response.json())
        .then(notes => renderNoteList(notes))
        .catch(error => console.error('Error fetching notes:', error));
    };
  
    // Function to save a note
    const saveNote = () => {
      const note = {
        title: noteTitle.value,
        text: noteText.value
      };
  
      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
      })
        .then(response => response.json())
        .then(savedNote => {
          console.log('Note saved:', savedNote);
          fetchNotes(); // Refresh the note list
          clearNoteForm(); // Clear the note form
        })
        .catch(error => console.error('Error saving note:', error));
    };
  
    // Function to delete a note
    const deleteNote = (id) => {
      fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (response.ok) {
            console.log('Note deleted');
            fetchNotes(); // Refresh the note list
            clearNoteForm(); // Clear the note form
          } else {
            console.error('Error deleting note:', response.statusText);
          }
        })
        .catch(error => console.error('Error deleting note:', error));
    };
  
    // Function to render the note list
    const renderNoteList = (notes) => {
      noteList.innerHTML = '';
  
      if (notes.length === 0) {
        const noNotesMessage = document.createElement('li');
        noNotesMessage.textContent = 'No saved notes';
        noteList.appendChild(noNotesMessage);
      } else {
        notes.forEach(note => {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.innerHTML = `
            <span class="list-item-title">${note.title}</span>
            <i class="fas fa-trash-alt float-right text-danger delete-note" data-note-id="${note.id}"></i>
          `;
          listItem.querySelector('.delete-note').addEventListener('click', (event) => {
            const noteId = event.target.getAttribute('data-note-id');
            deleteNote(noteId);
          });
          noteList.appendChild(listItem);
        });
      }
    };
  
    // Function to clear the note form
    const clearNoteForm = () => {
      noteTitle.value = '';
      noteText.value = '';
    };
  
    // Event listener for the save note button
    saveNoteBtn.addEventListener('click', () => {
      saveNote();
    });
  
    // Event listener for the new note button
    newNoteBtn.addEventListener('click', () => {
      clearNoteForm();
    });
  
    // Initial fetch to load and render the notes
    fetchNotes();
  });
  