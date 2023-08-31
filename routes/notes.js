const notes = require('express').Router();
const uuid = require('../helpers/uuid');

const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

  notes.delete('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.note_id !== noteId);
  
        writeToFile('./db/db.json', result);

        res.json(`Item ${noteId} has been deleted`);
      });
  });
  
  notes.post('/', (req, res) => {
    console.log(req.body);
  
    const { note } = req.body;
  
    if (req.body) {
      const newNote = {
        note,
        tip_id: uuid(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully`);
    } else {
      res.error('Error in adding note');
    }
  });
  
  module.exports = notes;
  