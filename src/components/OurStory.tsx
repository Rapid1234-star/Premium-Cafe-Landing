import { motion } from 'motion/react';

export default function OurStory() {
  return (
    <section id="story" className="py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image Composition */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[2rem] overflow-hidden aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4] max-w-md mx-auto lg:mr-auto lg:ml-0 shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop"
                alt="Barista making coffee"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Decorative Offset Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-12 -right-6 lg:-right-12 w-48 lg:w-64 aspect-square rounded-[2rem] border-[12px] border-cream overflow-hidden shadow-2xl hidden md:block"
            >
              <img
                src="/images/coffee-beans.jpg"
                alt="Coffee Beans"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Right: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-espresso mb-8 leading-[1.1]">
              A Café Built <br className="hidden md:block" />
              <span className="italic text-charcoal/80">Around the Pause.</span>
            </h2>
            
            <div className="space-y-6 text-espresso/70 text-lg max-w-lg mb-12">
              <p>
                In a world that constantly asks us to move faster, Ember & Bean was created as a place to slow down. We believe that good coffee shouldn't be rushed, and the best conversations happen when you give them time to unfold.
              </p>
              <p>
                Every bean we pull, every pastry we bake, and every space we've designed serves one purpose: to give you a moment of genuine warmth in your day.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-espresso/10">
              <div>
                <div className="text-3xl font-serif text-terracotta mb-1">12+</div>
                <div className="text-sm text-espresso/60 font-medium">Signature Drinks</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-terracotta mb-1">7 AM</div>
                <div className="text-sm text-espresso/60 font-medium">Doors Open</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-terracotta mb-1">100%</div>
                <div className="text-sm text-espresso/60 font-medium">Made With Care</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
