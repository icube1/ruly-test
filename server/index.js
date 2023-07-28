import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

let emails = {};
let folders = [];

app.post('/emails', (req, res) => {
  const { from, theme, message, folderId } = req.body;
  const id = generateId();
  const sentAt = new Date();
  const email = {
    id,
    from,
    theme,
    message,
    opened: false,
    sentAt,
    folderId,
  };
  emails[id] = email;
  saveDataToFile();
  res.status(201).json({ id, message: 'Email stored successfully!' });
});

app.get('/emails', (req, res) => {
  const emailList = Object.values(emails).map(({ id, from, theme, message, opened, sentAt, folderId }) => ({
    id,
    from,
    theme,
    message,
    opened,
    sentAt,
    folderId,
  }));
  res.json(emailList);
});

app.get('/folders', (req, res) => {
  const folderList = folders.map(({ id, folderName, emails }) => ({
    id,
    folderName,
    emails,
  }));
  res.json(folderList);
});
app.patch('/emails/:id', (req, res) => {
  const id = req.params.id;
  const { opened } = req.body;
  if (emails[id]) {
    emails[id].opened = opened;
    saveDataToFile();
    res.json({ message: 'Email updated successfully!' });
  } else {
    res.status(404).json({ error: 'Email not found!' });
  }
});

app.delete('/emails/:id', (req, res) => {
  const id = req.params.id;
  if (emails[id]) {
    delete emails[id];
    removeEmailFromFolders(id);
    saveDataToFile();
    res.json({ message: 'Email deleted successfully!' });
  } else {
    res.status(404).json({ error: 'Email not found!' });
  }
});

app.post('/folders', (req, res) => {
  const { folderName } = req.body;
  const id = generateId();
  const folder = {
    id,
    folderName,
    emails: [],
  };
  folders.push(folder);
  saveDataToFile();
  res.status(201).json({ id, message: 'Folder created successfully!' });
});

app.patch('/folders/:folderId/emails/:emailId', (req, res) => {
  const folderId = req.params.folderId;
  const emailId = req.params.emailId;
  const folder = folders.find((folder) => folder.id === folderId);
  if (folder && emails[emailId]) {
    const index = folder.emails.indexOf(emailId);
    if (index !== -1) {
      folder.emails.splice(index, 1);
      saveDataToFile();
      res.json({ message: 'Email removed from folder successfully!' });
    } else {
      res.status(404).json({ error: 'Email not found in folder!' });
    }
  } else {
    res.status(404).json({ error: 'Folder or email not found!' });
  }
});

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function saveDataToFile() {
  const data = JSON.stringify({ emails, folders });
  fs.writeFile('data.json', data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data saved to file!');
    }
  });
}

function removeEmailFromFolders(emailId) {
  for (const folder of folders) {
    const index = folder.emails.indexOf(emailId);
    if (index !== -1) {
      folder.emails.splice(index, 1);
    }
  }
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});