import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function SignatureMenu() {
  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl text-espresso mb-4">
              Made for Your Kind of Day
            </h2>
            <p className="text-espresso/70 text-lg">
              Our signature offerings, crafted with care to bring a little extra warmth to your routine.
            </p>
          </div>
          <a
            href="#menu"
            className="group flex items-center text-terracotta font-medium hover:text-espresso transition-colors whitespace-nowrap"
          >
            See Full Menu
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
          {/* Large Feature Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="md:col-span-12 lg:col-span-7 group relative rounded-[2rem] overflow-hidden bg-ivory shadow-sm aspect-square md:aspect-[16/9] lg:aspect-auto lg:h-[600px]"
          >
            <img
              src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop"
              alt="Ember Latte"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full text-ivory">
              <span className="inline-block px-3 py-1 bg-terracotta text-ivory text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                House Signature
              </span>
              <h3 className="font-serif text-3xl md:text-4xl mb-2">The Ember Latte</h3>
              <p className="text-ivory/80 max-w-md mb-4">
                Our namesake. Smooth espresso layered with smoked vanilla bean syrup and lightly toasted oat milk, dusted with cinnamon.
              </p>
              <span className="text-xl font-medium">$6.50</span>
            </div>
          </motion.div>

          {/* Right Column Stack */}
          <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6 lg:gap-10">
            {/* Top Right Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative rounded-[2rem] overflow-hidden bg-ivory shadow-sm h-[285px]"
            >
              <img
                src="/images/pistachio-croissant.jpg"
                alt="Pistachio Croissant"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full text-ivory">
                <h3 className="font-serif text-2xl mb-1">Pistachio Croissant</h3>
                <p className="text-ivory/80 text-sm mb-2 line-clamp-1">Twice-baked, filled with rich pistachio frangipane.</p>
                <span className="font-medium">$5.50</span>
              </div>
            </motion.div>

            {/* Bottom Right Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group relative rounded-[2rem] overflow-hidden bg-ivory shadow-sm h-[285px]"
            >
              <img
                src="/images/truffle-toast.jpg"
                alt="Truffle Mushroom Toast"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full text-ivory">
                <h3 className="font-serif text-2xl mb-1">Truffle Mushroom Toast</h3>
                <p className="text-ivory/80 text-sm mb-2 line-clamp-1">Wild mushrooms, whipped ricotta, truffle oil on sourdough.</p>
                <span className="font-medium">$12.00</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
