import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Header } from './header'
import { Home } from './page/home'
import { Cadastro } from './page/cadastro'
import { Footer } from './components/footer'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App