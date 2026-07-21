import Header from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Ventures from '@/components/site/Ventures';
import UgcShowcase from '@/components/site/UgcShowcase';
import Contact from '@/components/site/Contact';
import Footer from '@/components/site/Footer';
import { getHomeData } from '@/lib/server/store';

// Safety net; the admin POST routes trigger revalidateTag/revalidatePath on save.
export const revalidate = 300;

export default async function Home() {
  const { sales, milestones } = await getHomeData();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Ventures sales={sales} />
        <UgcShowcase sales={sales} milestones={milestones} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
