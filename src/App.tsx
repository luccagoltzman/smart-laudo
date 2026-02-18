import { Routes, Route } from 'react-router-dom';
import { ChecklistPage } from './pages/ChecklistPage';
import { HomePage } from './pages/HomePage';
import { SummaryPage } from './pages/SummaryPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checklist" element={<ChecklistPage />} />
      <Route path="/resumo" element={<SummaryPage />} />
    </Routes>
  );
}
