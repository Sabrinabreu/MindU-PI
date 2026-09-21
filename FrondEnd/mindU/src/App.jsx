import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { Header } from './header'
import { About } from './components/quemSomos'
import { SessaoPlanos } from './components/cardPlanos'
import { PorQueMindU } from './components/cardBeneficios'
import { Depoimentos } from './components/depoimentos'
import { Footer } from './components/footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <About/>
    <SessaoPlanos/>
    <PorQueMindU/>
    <Depoimentos/>
    <Footer/>
    </>
  )
}

export default App
