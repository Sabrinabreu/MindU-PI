import { useState } from 'react'
import { About } from '../components/quemSomos'
import { SessaoPlanos } from '../components/cardPlanos'
import { PorQueMindU } from '../components/cardBeneficios'
import { Depoimentos } from '../components/depoimentos'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
    <About/>
    <SessaoPlanos/>
    <PorQueMindU/>
    <Depoimentos/>
    </>
  )
}

export default Home
