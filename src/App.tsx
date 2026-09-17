/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScrollAnimation from './components/ScrollAnimation';
import FeatureStrip from './components/FeatureStrip';
import SignatureMenu from './components/SignatureMenu';
import InteractiveMenu from './components/InteractiveMenu';
import OurStory from './components/OurStory';
import TheExperience from './components/TheExperience';
import VisualBreak from './components/VisualBreak';
import Reviews from './components/Reviews';
import Gallery from './components/Gallery';
import Reservation from './components/Reservation';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

export default function App() {
  return (
    <div className="relative scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <ScrollAnimation />
        <FeatureStrip />
        <SignatureMenu />
        <InteractiveMenu />
        <OurStory />
        <TheExperience />
        <VisualBreak />
        <Reviews />
        <Gallery />
        <Reservation />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
