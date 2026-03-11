import { Hero } from "@/components/home/Hero";
import { PromoBanner } from "@/components/home/PromoBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { BrandPartners } from "@/components/home/BrandPartners";
import { ContactSection } from "@/components/home/ContactSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <PromoBanner />
      <FeaturedProducts />
      <HowItWorks />
      <ServicesGrid />
      <Testimonials />
      <BrandPartners />
      <ContactSection />
    </>
  );
}
