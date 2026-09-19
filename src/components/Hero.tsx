import { motion } from 'motion/react';
import { ArrowRight, Star, Bean } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-cream -z-10 rounded-bl-[120px] opacity-70"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-caramel/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 -left-24 w-80 h-80 bg-sage/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="relative z-10 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ivory/50 backdrop-blur-sm border border-espresso/10 text-terracotta mb-6 shadow-sm"
            >
              <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <Bean className="w-6 h-6" />
              </motion.div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-espresso leading-[1.1] mb-8">
              Slow Mornings.<br />
              Bold Coffee.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-espresso/80 mb-10 max-w-lg leading-relaxed"
          >
            Ember & Bean is a place for <span className="font-medium text-espresso">specialty coffee</span>, <span className="font-medium text-espresso">freshly prepared food</span>, <span className="font-medium text-espresso">deep conversations</span>, and relaxed moments. Take your time, we've got the coffee ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#visit"
              className="px-8 py-4 bg-espresso text-ivory font-medium rounded-full hover:bg-charcoal transition-all duration-300 shadow-md hover:shadow-lg flex items-center group"
            >
              Reserve a Table
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#menu"
              className="px-8 py-4 bg-transparent text-espresso font-medium rounded-full border border-espresso/20 hover:bg-espresso/5 transition-colors duration-300"
            >
              Explore Our Menu
            </a>
          </motion.div>
        </div>

        {/* Image Composition */}
        <div className="relative z-10 lg:h-[700px] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"
                alt="Ember & Bean Cafe Interior"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent"></div>
            </div>

            {/* Offset Image Layer (Decorative) */}
            <div className="absolute -bottom-8 -left-8 w-48 aspect-square rounded-full border-8 border-ivory overflow-hidden shadow-xl hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1000&auto=format&fit=crop"
                alt="Latte Art"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="absolute top-12 -right-6 md:-right-12 bg-ivory p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-[200px]"
            >
              <div className="bg-caramel/10 p-3 rounded-full text-caramel">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="font-bold text-espresso">4.9/5</div>
                <div className="text-xs text-espresso/60">Over 500+ reviews from locals</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
