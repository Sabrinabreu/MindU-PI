import { useState } from 'react'
import './App.css'
import { Header } from './header'
import { Home } from './page/home'
import { Footer } from './components/footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <Home/>
    <Footer/>
    </>
  )
}

export default App
