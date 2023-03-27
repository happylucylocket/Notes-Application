const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;

    fetch('/addNote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ title, body })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));

    // Clear the fields after submitting
    document.querySelector('#title').value = '';
    document.querySelector('#body').value = '';
    location.reload();
});

fetch('/getNotes', {
    method: 'GET'
})
.then(response => response.json())
.then(notes => {
    const notesList = document.querySelector('#notesList');

    notesList.innerHTML = '';

    notes.forEach(note => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = note.title;
        link.href = '#${note.id}';
        link.onclick = function() {
            displayNote(note.id, note.title, note.body, note.last_edited);
        }
        item.appendChild(link);
        notesList.appendChild(item);
    });
})
.catch(err => (
    console.error('Error retrieving notes', err)
));

function displayNote(id, title, body, last_edited) {
    $('#modalTitle').val(title);
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('lastEdited').innerHTML = "Last edited: " + new Date(last_edited);
    document.getElementById('noteId').innerHTML = id;

    $('#noteModal').modal('show');
}

function closeModal() {
    $('#noteModal').modal('hide');
}

function saveNote() {
    var id = $('#noteId').val();
    id = document.getElementById('noteId').innerHTML;
    var body = $('#modalBody').val();
    var title = $('#modalTitle').val();

    fetch('/updateNote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ title, body, id })
    }).then(response => response.text()).then(data => console.log(data)).catch(error => console.error(error));

    $('#noteModal').modal('hide');
    location.reload();
}

function deleteNote() {
    var id = $('#noteId').val();
    id = document.getElementById('noteId').innerHTML;

    fetch('/deleteNote', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ title, body, id })
    }).then(response => response.text()).then(data => console.log(data)).catch(error => console.error(error));

    $('#noteModal').modal('hide');
    location.reload();
}