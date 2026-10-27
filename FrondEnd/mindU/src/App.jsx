import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';


import { Home } from './page/home';
import { Contato } from './page/contato';
import { Cadastro } from './page/cadastro';
import { Login } from './page/login';
import { Perfil } from './page/perfil';
import { Agenda } from './page/agenda';
import { BuscaProfissional } from './page/buscaProfissional';
import { AgendarConsulta } from './page/agendarConsulta';
import { Historico } from './page/historico';
import { DashboardEmpresa } from './page/dashboardEmpresa';


import { Header } from './header';
import { Footer } from './components/footer';
import { Sidebar } from './components/sidebar';


import { RotaProtegida } from './components/rotasProtegidas';
import { useUsuario } from './hooks/useUsuario';

const ROTAS_SEM_FOOTER = ['/cadastro', '/login', '/recuperar-senha'];

function App() {
  const location = useLocation();
  const usuario = useUsuario();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header
        usuario={usuario}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <Sidebar
        usuario={usuario}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas logadas (qualquer tipo) */}
        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          }
        />

        {/* ===== ROTAS POR TIPO ===== */}

        {/* Beneficiário */}
        <Route
          path="/profissionais"
          element={
            <RotaProtegida tipos={['BENEFICIARIO']}>
              <BuscaProfissional titulo="Buscar Profissionais" />
            </RotaProtegida>
          }
        />
        <Route 
          path="/agendar" 
          element={
            <RotaProtegida tipos={['BENEFICIARIO']}>
              <AgendarConsulta />
            </RotaProtegida>
          } 
        />
        <Route
          path="/historico"
          element={
            <RotaProtegida tipos={['BENEFICIARIO']}>
              <Historico titulo="Histórico" />
            </RotaProtegida>
          }
        />

        {/* Profissional */}
        <Route
          path="/agenda"
          element={
            <RotaProtegida tipos={['PROFISSIONAL', 'BENEFICIARIO']}>
              <Agenda titulo="Minha Agenda" />
            </RotaProtegida>
          }
        />
        <Route
          path="/consultas"
          element={
            <RotaProtegida tipos={['PROFISSIONAL']}>
              <Placeholder titulo="Minhas Consultas" />
            </RotaProtegida>
          }
        />
        <Route
          path="/disponibilidade"
          element={
            <RotaProtegida tipos={['PROFISSIONAL']}>
              <Placeholder titulo="Disponibilidade" />
            </RotaProtegida>
          }
        />
        <Route
          path="/locais"
          element={
            <RotaProtegida tipos={['PROFISSIONAL']}>
              <Placeholder titulo="Meus Locais" />
            </RotaProtegida>
          }
        />

        {/* Empresa */}
        <Route
          path="/dashboard"
          element={
            <RotaProtegida tipos={['EMPRESA']}>
              <DashboardEmpresa titulo="Dashboard" />
            </RotaProtegida>
          }
        />
        <Route
          path="/colaboradores"
          element={
            <RotaProtegida tipos={['EMPRESA']}>
              <Placeholder titulo="Colaboradores" />
            </RotaProtegida>
          }
        />
        <Route
          path="/matriculas"
          element={
            <RotaProtegida tipos={['EMPRESA']}>
              <Placeholder titulo="Matrículas" />
            </RotaProtegida>
          }
        />
        <Route
          path="/relatorios"
          element={
            <RotaProtegida tipos={['EMPRESA', 'ADMIN']}>
              <Placeholder titulo="Relatórios" />
            </RotaProtegida>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/empresas"
          element={
            <RotaProtegida tipos={['ADMIN']}>
              <Placeholder titulo="Empresas (Admin)" />
            </RotaProtegida>
          }
        />
        <Route
          path="/admin/profissionais"
          element={
            <RotaProtegida tipos={['ADMIN']}>
              <Placeholder titulo="Profissionais (Admin)" />
            </RotaProtegida>
          }
        />
        <Route
          path="/admin/clientes"
          element={
            <RotaProtegida tipos={['ADMIN']}>
              <Placeholder titulo="Clientes (Admin)" />
            </RotaProtegida>
          }
        />
        <Route
          path="/admin/relatorios"
          element={
            <RotaProtegida tipos={['ADMIN']}>
              <Placeholder titulo="Relatórios (Admin)" />
            </RotaProtegida>
          }
        />
        <Route
          path="/admin/config"
          element={
            <RotaProtegida tipos={['ADMIN']}>
              <Placeholder titulo="Configurações (Admin)" />
            </RotaProtegida>
          }
        />
      </Routes>

      {!ROTAS_SEM_FOOTER.includes(location.pathname) && <Footer />}
    </>
  );
}

// Placeholder temporário — trocar por páginas reais depois
function Placeholder({ titulo }) {
  return (
    <div style={{ maxWidth: 900, margin: '4rem auto', padding: '0 2rem' }}>
      <h1 style={{ color: 'var(--primary)' }}>{titulo}</h1>
      <p style={{ color: 'var(--text-s)' }}>
        Esta página está em construção. Volte em breve!
      </p>
    </div>
  );
}

export default App;