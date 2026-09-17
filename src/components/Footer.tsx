export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/80 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-4">
            <a href="#" className="font-serif text-3xl font-bold text-ivory mb-6 block">
              E&B<span className="text-terracotta">.</span>
            </a>
            <p className="max-w-xs leading-relaxed">
              Slow Mornings. Bold Coffee. Good Company. A premium modern café experience.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="font-serif text-ivory text-lg mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="hover:text-terracotta transition-colors">Home</a></li>
              <li><a href="#story" className="hover:text-terracotta transition-colors">Our Story</a></li>
              <li><a href="#menu" className="hover:text-terracotta transition-colors">Menu</a></li>
              <li><a href="#experience" className="hover:text-terracotta transition-colors">Experience</a></li>
              <li><a href="#reviews" className="hover:text-terracotta transition-colors">Reviews</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-serif text-ivory text-lg mb-6">Visit</h4>
            <ul className="space-y-4">
              <li>124 Maple Street</li>
              <li>Mon—Sun</li>
              <li>7:00 AM — 10:00 PM</li>
              <li><a href="tel:+15551234567" className="hover:text-terracotta transition-colors">+1 (555) 123-4567</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-serif text-ivory text-lg mb-6">Follow</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-terracotta transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-terracotta transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-terracotta transition-colors">TikTok</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-ivory/10 text-sm text-ivory/40 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Ember & Bean Café. All rights reserved.</p>
          <div className="space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-ivory transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ivory transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
