const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadBtn = document.getElementById('load-btn');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('status');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title-input');
const bodyInput = document.getElementById('body-input');
const notesList = document.getElementById('notes-list');

function setStatus(message, type = '') {
    statusEl.textContent = message;
    statusEl.className = type; // '', 'success', 'error', 'loading', 'info'
}

async function request(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        throw error;
    }
}

async function getNotes() {
    loadBtn.disabled = true;
    submitBtn.disabled = true;
    setStatus('Loading notes...', 'loading');
    
    try {
        const notes = await request(`${API_URL}?_limit=10`);
        notesList.innerHTML = ''; // Clear previous
        
        if (notes.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.textContent = 'No notes to display. Create one above!';
            notesList.appendChild(emptyMsg);
            setStatus('No notes found.', 'info');
            return;
        }
        
        notes.forEach(note => renderNote(note));
        setStatus(`Loaded ${notes.length} notes from the server.`, 'success');
    } catch (error) {
        setStatus(`Error loading notes: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
        submitBtn.disabled = false;
    }
}

async function createNote(title, body) {
    loadBtn.disabled = true;
    submitBtn.disabled = true;
    setStatus('Creating note...', 'loading');
    
    try {
        const response = await request(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });
        
        // Note on JSONPlaceholder: It simulates a POST but doesn't persist it.
        // We optimistically prepend it to the UI to simulate success.
        renderNote(response, true);
        setStatus(`Note created (status 201, id ${response.id}).`, 'success');
        noteForm.reset();
    } catch (error) {
        setStatus(`Error creating note: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
        submitBtn.disabled = false;
    }
}

async function deleteNote(id) {
    loadBtn.disabled = true;
    submitBtn.disabled = true;
    setStatus(`Deleting note ${id}...`, 'loading');
    
    try {
        await request(`${API_URL}/${id}`, { method: 'DELETE' });
        
        // Note on JSONPlaceholder: DELETE requests are simulated and not persisted.
        // We optimistically remove the item from the DOM to simulate success.
        const noteItem = document.getElementById(`note-${id}`);
        if (noteItem) noteItem.remove();
        
        if (notesList.children.length === 0) {
            setStatus('No notes remaining.', 'info');
        } else {
            setStatus(`Note ${id} deleted successfully.`, 'success');
        }
    } catch (error) {
        setStatus(`Error deleting note: ${error.message}`, 'error');
    } finally {
        loadBtn.disabled = false;
        submitBtn.disabled = false;
    }
}

function renderNote(note, prepend = false) {
    const li = document.createElement('li');
    li.id = `note-${note.id}`;
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = note.title;
    
    const bodyEl = document.createElement('p');
    bodyEl.textContent = note.body;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', () => deleteNote(note.id));
    
    li.appendChild(titleEl);
    li.appendChild(bodyEl);
    li.appendChild(deleteBtn);
    
    if (prepend && notesList.firstChild) {
        notesList.insertBefore(li, notesList.firstChild);
    } else {
        notesList.appendChild(li);
    }
}

// Event Listeners
loadBtn.addEventListener('click', getNotes);

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    
    if (!title) {
        setStatus('Title is required.', 'error');
        return;
    }
    if (title.length > 100) {
        setStatus('Title cannot exceed 100 characters.', 'error');
        return;
    }
    
    createNote(title, body);
});