import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NotesPage from './pages/NotesPage';

const token = localStorage.getItem('token');

export default function App() {
  return (
    <Routes>
      <Route path="" element={token ? <NotesPage /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}