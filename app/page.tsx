import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import About from "@/components/About";
import ForWho from "@/components/ForWho";
import Mechanism from "@/components/Mechanism";
import Includes from "@/components/Includes";
import Testimonials from "@/components/Testimonials";
import Offer from "@/components/Offer";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <About />
        <ForWho />
        <Mechanism />
        <Includes />
        <Testimonials />
        <Offer />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
