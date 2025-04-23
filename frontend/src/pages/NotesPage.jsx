import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SearchNotes from './components/SearchNotes';
import ThemeToggle from './components/ThemeToggle'; // Import the new component

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const fetchNotes = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4002/notes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setNotes(data);
        setFilteredNotes(data);
      })
      .catch(() => alert('Ошибка загрузки заметок'));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:4002/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        toast.success('Заметка создана');
        setTitle('');
        setContent('');
        fetchNotes();
      } else {
        alert('Ошибка при создании заметки');
      }
    } catch (err) {
      alert('Ошибка сети');
    }
  };

  const handleDeleteNote = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:4002/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      await fetchNotes();
    } catch (err) {
      alert('Ошибка сети');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>Твои заметки</h1>
        <div className="notes-actions">
          <ThemeToggle /> {/* Add theme toggle component */}
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </div>

      <SearchNotes notes={notes} setFilteredNotes={setFilteredNotes} />

      <div className="add-note-form">
        <input
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Содержание"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className={`${title && content ? '' : 'dis'}`} onClick={handleAddNote}>
          Добавить заметку
        </button>
      </div>

      {filteredNotes.length > 0 ? filteredNotes.map(note => (
        <div className="note-item" key={note.id}>
          <strong>{note.title}</strong>
          <p>{note.content}</p>
          <button onClick={() => handleDeleteNote(note.id)}>Удалить заметку</button>
        </div>
      )) : <div className="empty-notes">{notes.length > 0 ? 'Заметки не найдены' : 'Загрузка...'}</div>}
    </div>
  );
}