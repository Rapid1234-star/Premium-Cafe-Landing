import { motion } from 'motion/react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';

export default function Reservation() {
  return (
    <section id="visit" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-espresso text-ivory rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2">
            
            {/* Left: Info */}
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-serif text-4xl md:text-5xl mb-12">Your Table Is Waiting</h2>
                
                <div className="space-y-8 mb-16">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-terracotta shrink-0 mt-1" />
                    <div>
                      <div className="font-serif text-xl mb-1">Location</div>
                      <div className="text-ivory/70">124 Maple Street, historic district.<br/>Plenty of street parking available.</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-terracotta shrink-0 mt-1" />
                    <div>
                      <div className="font-serif text-xl mb-1">Hours</div>
                      <div className="text-ivory/70">Monday — Sunday<br/>7:00 AM — 10:00 PM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-terracotta shrink-0 mt-1" />
                    <div>
                      <div className="font-serif text-xl mb-1">Contact</div>
                      <div className="text-ivory/70">+1 (555) 123-4567<br/>hello@emberandbean.com</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-terracotta text-ivory font-medium rounded-full hover:bg-terracotta/90 transition-colors shadow-md">
                    Reserve a Table
                  </button>
                  <button className="px-8 py-4 bg-transparent text-ivory border border-ivory/20 font-medium rounded-full hover:bg-ivory/10 transition-colors flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right: Map/Image Area */}
            <div className="relative h-[400px] lg:h-auto bg-charcoal">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" 
                alt="Ember & Bean Location"
                className="w-full h-full object-cover opacity-60"
              />
              {/* Stylized Map Overlay Marker */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", delay: 0.5 }}
                  className="bg-ivory text-espresso p-4 rounded-2xl shadow-2xl text-center"
                >
                  <div className="font-serif font-bold text-lg">Ember & Bean</div>
                  <div className="text-sm text-espresso/70 mt-1">124 Maple St.</div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
