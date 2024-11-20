const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

function loadSongs() {
    const filePath = path.join(__dirname, '..', 'songs.json');
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (error) {
        return [];  
    }
}

function saveSongs(songs) {
    const filePath = path.join(__dirname, '..', 'songs.json');
    fs.writeFileSync(filePath, JSON.stringify(songs, null, 2));
}

router.get('/', (req, res) => {
    const songs = loadSongs();
    res.render('index', { songs });
});

router.post('/add-song', upload.single('albumCover'), (req, res) => {
    const { songName, albumTitle, lyrics } = req.body;
    const albumCoverPath = `/uploads/${req.file.filename}`;  

    const newSong = {
        id: Date.now(), 
        songName,
        albumTitle,
        albumCoverPath,
        lyrics
    };

    const songs = loadSongs();
    songs.push(newSong);  
    saveSongs(songs);  

    res.redirect('/');
});

router.post('/delete-song/:id', (req, res) => {
    const { id } = req.params;
    let songs = loadSongs();
    songs = songs.filter(song => song.id !== parseInt(id));  
    saveSongs(songs);  

    res.redirect('/');
});

module.exports = router;
