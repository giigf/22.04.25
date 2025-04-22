import { useEffect, useState } from 'react';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:4002/notes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setNotes)
      .catch(() => alert('Ошибка загрузки заметок'));
  }, []);

  return (
    <div>
      <h2>Твои заметки</h2>
      {notes.map(note => (
        <div key={note.id}>
          <strong>{note.title}</strong>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}