const fs = require("fs");
const path = require("path");
const notesData = require("../db/db.json");
const express = require("express");
const router = express.Router();


let notes = notesData;

const saveDb = () => {
    fs.writeFileSync(
        path.resolve(__dirname, "../db/db.json"), 
        JSON.stringify(notes)
    );
};

router.get("/notes", (req, res) => {
    notes = notes.map((note, index) => ({
        ...note,
        id: index,
    }));
    
    console.log(notes);
    res.json(notes);
});

router.post("/notes", (req, res) => {
    console.log(req.body);
    notes.push(req.body);
    saveDb();
    res.json(notes);
});

router.delete("/notes/:id", (req, res) => {
    console.log(req.params.id);
    notes.splice(req.params.id, 1);
    res.json(notes);
});

module.exports = router;