import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MatchPage from './pages/MatchPage';
import Vip from './pages/Vip';
import Concept from './pages/Concept';
import Analyses from './pages/Analyses';
import Faq from './pages/Faq';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function defaultLang() {
  return typeof navigator !== 'undefined' && navigator.language.startsWith('fr') ? 'fr' : 'en';
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${defaultLang()}`} replace />} />
      <Route path="/:lang" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="match/:id" element={<MatchPage />} />
        <Route path="vip" element={<Vip />} />
        <Route path="concept" element={<Concept />} />
        <Route path="bilan" element={<Analyses />} />
        <Route path="faq" element={<Faq />} />
        <Route path="connexion" element={<Auth mode="login" />} />
        <Route path="inscription" element={<Auth mode="register" />} />
        <Route path="compte" element={<Account />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
