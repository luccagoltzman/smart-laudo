import { Routes, Route } from 'react-router-dom';
import { ChecklistPage } from './pages/ChecklistPage';
import { ChecklistLojaPage } from './pages/ChecklistLojaPage';
import { HomePage } from './pages/HomePage';
import { SummaryPage } from './pages/SummaryPage';
import { SummaryLojaPage } from './pages/SummaryLojaPage';
import { ValidatePage } from './pages/ValidatePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checklist" element={<ChecklistPage />} />
      <Route path="/resumo" element={<SummaryPage />} />
      <Route path="/loja/checklist" element={<ChecklistLojaPage />} />
      <Route path="/loja/checklist/:vehicleId" element={<ChecklistLojaPage />} />
      <Route path="/loja/resumo" element={<SummaryLojaPage />} />
      <Route path="/validar/:id" element={<ValidatePage />} />
    </Routes>
  );
}
