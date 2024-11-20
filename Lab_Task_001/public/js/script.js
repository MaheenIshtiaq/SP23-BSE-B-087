let songs = JSON.parse(localStorage.getItem('songs')) || [];

let editingIndex = null;

function displaySongs() {
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; 

    songs.forEach((song, index) => {
        const songItem = `
            <li>
                <h3>${song.songName}</h3>
                <p><strong>Album:</strong> ${song.albumTitle}</p>
                <p><strong>Lyrics:</strong> ${song.lyrics}</p>
                <img src="${song.albumCover}" alt="Album Cover" width="100" height="100">
                <button onclick="editSong(${index})">Edit</button>
                <button onclick="deleteSong(${index})">Delete</button>
            </li>
        `;
        songList.innerHTML += songItem;
    });
}

document.getElementById('songForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const songName = document.getElementById('songName').value;
    const albumTitle = document.getElementById('albumTitle').value;
    const lyrics = document.getElementById('lyrics').value;
    const albumCoverFile = document.getElementById('albumCover').files[0];

    if (!songName || !albumTitle || !lyrics) {
        alert('Please fill in all fields');
        return;
    }

    if (albumCoverFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const albumCover = event.target.result;

            const newSong = {
                songName,
                albumTitle,
                lyrics,
                albumCover
            };

            if (editingIndex !== null) {
                songs[editingIndex] = newSong; 
                editingIndex = null;
            } else {
                songs.push(newSong);  
            }

            localStorage.setItem('songs', JSON.stringify(songs));

            document.getElementById('songForm').reset();
            displaySongs();
        };

        reader.readAsDataURL(albumCoverFile); 
    } else {
        alert('Please upload an album cover image.');
    }
});

function deleteSong(index) {
    songs.splice(index, 1);  
    localStorage.setItem('songs', JSON.stringify(songs));  
    displaySongs();  
}


function editSong(index) {
    const song = songs[index];


    document.getElementById('songName').value = song.songName;
    document.getElementById('albumTitle').value = song.albumTitle;
    document.getElementById('lyrics').value = song.lyrics;
    editingIndex = index; 
}

displaySongs();
