import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Our Story', href: '#story' },
    { name: 'Menu', href: '#menu' },
    { name: 'Experience', href: '#experience' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Visit Us', href: '#visit' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-ivory/90 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-serif text-2xl font-bold tracking-tight text-espresso">
          E&B<span className="text-terracotta">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          <ul className="flex space-x-8 text-sm font-medium text-espresso/80">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-terracotta transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-terracotta transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center text-xs text-espresso/70 font-medium">
            <span className="w-2 h-2 rounded-full bg-sage mr-2 animate-pulse"></span>
            Open Today
          </div>
          <a
            href="#visit"
            className="px-5 py-2.5 bg-espresso text-ivory text-sm font-medium rounded-full hover:bg-charcoal transition-colors duration-300 shadow-sm"
          >
            Reserve a Table
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-espresso"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-ivory shadow-lg border-t border-espresso/10"
          >
            <div className="flex flex-col py-6 px-6 space-y-6">
              <ul className="flex flex-col space-y-4 text-lg font-serif">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-espresso hover:text-terracotta transition-colors block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="pt-6 border-t border-espresso/10">
                <a
                  href="#visit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block px-6 py-3 bg-espresso text-ivory font-medium rounded-full hover:bg-charcoal transition-colors"
                >
                  Reserve a Table
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
