import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { Header } from './header'
import { About } from './components/quemSomos'
import { SessaoPlanos } from './components/cardPlanos'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <About/>
    <SessaoPlanos/>
    </>
  )
}

export default App
