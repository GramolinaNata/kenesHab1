import Footer from "@/shared/components/layout/Footer";
import Navbar from "@/shared/components/layout/Navbar";
import LandingPage from "@/shared/components/sections/LandingPage";

export default function Dasboard() {
  return(
    <main className="bg-white min-h-screen">
      <Navbar />
      <LandingPage />
      <Footer />
    </main>
  )
}