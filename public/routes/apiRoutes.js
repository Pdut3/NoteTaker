const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Helper function to read notes from the db.json file
const readNotesFromFile = () => {
  const filePath = path.join(__dirname, 'db/db.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write notes to the db.json file
const writeNotesToFile = (notes) => {
  const filePath = path.join(__dirname, 'db/db.json');
  fs.writeFileSync(filePath, JSON.stringify(notes));
};

// GET /api/notes - Get all notes
router.get('/notes', (req, res) => {
  const notes = readNotesFromFile();
  res.json(notes);
});

// POST /api/notes - Create a new note
router.post('/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required' });
  }

  const newNote = {
    id: Date.now().toString(),
    title,
    text,
  };

  const notes = readNotesFromFile();
  notes.push(newNote);
  writeNotesToFile(notes);

  res.json(newNote);
});

// DELETE /api/notes/:id - Delete a note by ID
router.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  const notes = readNotesFromFile();
  const updatedNotes = notes.filter((note) => note.id !== id);
  writeNotesToFile(updatedNotes);

  res.sendStatus(200);
});

module.exports = router;
