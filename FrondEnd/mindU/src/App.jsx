import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './header'
import { Home } from './page/home'
import { Cadastro } from './page/cadastro'
import { Footer } from './components/footer'

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
      {location.pathname !== '/cadastro' && <Footer />}
    </>
  )
}

export default App