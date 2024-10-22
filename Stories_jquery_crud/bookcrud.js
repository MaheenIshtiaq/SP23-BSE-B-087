let books = JSON.parse(localStorage.getItem('books')) || [];

let editingIndex = null;

function displayBooks() {
    const booksList = $('#booksList');
    booksList.empty(); 

    books.forEach((book, index) => {
        const bookCard = `
            <div class="card mb-4">
                <img src="${book.image}" class="book-image card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
                    <p class="card-text">${book.content}</p>
                    <button class="btn btn-danger" onclick="deleteBook(${index})">Delete</button>
                    <button class="btn btn-warning" onclick="editBook(${index})">Edit</button>
                </div>
            </div>
        `;
        booksList.append(bookCard);
    });
}


$('#createForm').on('submit', function(e) {
    e.preventDefault();

    const title = $('#createTitle').val();
    const author = $('#createAuthor').val();
    const content = $('#createContent').val();
    const image = $('#createImage')[0].files[0];

    const reader = new FileReader();
    reader.onload = function(event) {
        const newBook = {
            title,
            author,
            content,
            image: event.target.result 
        };

        if (editingIndex !== null) {
        
            books[editingIndex] = newBook; 
            editingIndex = null; 
        } else {
        
            books.push(newBook); 
        }

        localStorage.setItem('books', JSON.stringify(books)); 
        displayBooks(); 
        $('#createForm')[0].reset(); 
    };

    if (image) {
        reader.readAsDataURL(image); 
    } else {
        alert('Please upload a book cover image.'); 
    }
});


function deleteBook(index) {
    books.splice(index, 1); 
    localStorage.setItem('books', JSON.stringify(books)); 
    displayBooks(); 
}

function editBook(index) {
    editingIndex = index; 
    const book = books[index]; 

    
    $('#createTitle').val(book.title);
    $('#createAuthor').val(book.author);
    $('#createContent').val(book.content);
   
    $('#createImage').val(null); 
}

$(document).ready(function() {
    displayBooks();
});
