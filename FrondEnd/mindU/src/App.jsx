import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './header'
import { Home } from './page/home'
import { Contato } from './page/contato';
import { Cadastro } from './page/cadastro'
import { Login } from './page/login';
import { Footer } from './components/footer'

const ROTAS_SEM_FOOTER = [
  '/cadastro',
  '/login',
  '/recuperar-senha',
];

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {!ROTAS_SEM_FOOTER.includes(location.pathname) && <Footer />}
    </>
  )
}

export default App