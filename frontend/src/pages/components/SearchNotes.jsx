import { useState } from 'react';

export default function SearchNotes({ notes, setFilteredNotes }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      // If search is empty, show all notes
      setFilteredNotes(notes);
      return;
    }
    
    // Filter notes that contain the search term in title or content
    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(term.toLowerCase()) || 
      note.content.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredNotes(filtered);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Поиск заметок..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
}