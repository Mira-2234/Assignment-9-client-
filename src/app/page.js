import Banner from "./components/Banner";
import FeaturedPets from "./components/FeaturedPets";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PetCareTips from "./components/PetCare";
import SuccessStories from "./components/SuccessStories";
import WhyAdopt from "./components/WhyAdopt";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Banner />
      <FeaturedPets />
      <WhyAdopt />
      <SuccessStories />
      <PetCareTips />
      <Footer />
    </>
  );
}