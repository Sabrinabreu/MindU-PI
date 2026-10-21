import { About } from '../components/home/quemSomos';
import { SessaoPlanos } from '../components/home/cardPlanos';
import { PorQueMindU } from '../components/home/cardBeneficios';
import { Depoimentos } from '../components/home/depoimentos';

export function Home() {
  return (
    <main>
      <About />
      <PorQueMindU />
      <Depoimentos />
      <SessaoPlanos />
    </main>
  );
}

export default Home;