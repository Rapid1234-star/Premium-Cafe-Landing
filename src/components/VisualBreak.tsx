import { motion } from 'motion/react';

export default function VisualBreak() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1 }}
          whileInView={{ scale: 1.1 }}
          viewport={{ once: false }}
          transition={{ duration: 10, ease: "linear" }}
          src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2000&auto=format&fit=crop"
          alt="Atmospheric cafe scene"
          className="w-full h-full object-cover origin-center"
        />
        <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[2px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-ivory mb-6 leading-tight">
          "Stay for one more cup."
        </h2>
        <p className="text-xl md:text-2xl text-ivory/80 font-light max-w-2xl mx-auto">
          Good coffee has a way of making time slow down.
        </p>
      </motion.div>
    </section>
  );
}
