import { motion } from 'motion/react';

const experiences = [
  {
    title: 'Morning Ritual',
    desc: 'Start your day right with a perfectly dialed-in espresso and a fresh pastry warm from the oven.',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop',
    align: 'left'
  },
  {
    title: 'Work & Create',
    desc: 'Find your focus. Comfortable seating, ample power outlets, and reliable Wi-Fi for your deep work sessions.',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1000&auto=format&fit=crop',
    align: 'right'
  },
  {
    title: 'Meet & Unwind',
    desc: 'The perfect backdrop for catching up with old friends or making new ones over a warm cup.',
    image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=1000&auto=format&fit=crop',
    align: 'left'
  }
];

export default function TheExperience() {
  return (
    <section id="experience" className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="font-serif text-4xl md:text-5xl text-espresso mb-6">More Than Just Coffee</h2>
          <p className="text-espresso/70 text-lg">
            We've designed our space to seamlessly fit into the different parts of your day.
          </p>
        </div>

        <div className="space-y-24 lg:space-y-32">
          {experiences.map((exp, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col lg:flex-row items-center gap-12 ${exp.align === 'right' ? 'lg:flex-row-reverse' : ''}`}
            >
              <motion.div 
                initial={{ opacity: 0, x: exp.align === 'left' ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
              >
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden group">
                  <img 
                    src={exp.image} 
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 lg:px-12 text-center lg:text-left"
              >
                <h3 className="font-serif text-3xl md:text-4xl text-espresso mb-4">{exp.title}</h3>
                <p className="text-lg text-espresso/70 leading-relaxed max-w-md mx-auto lg:mx-0">
                  {exp.desc}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
