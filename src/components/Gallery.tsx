import { motion } from 'motion/react';

const images = [
  { url: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-12 md:col-span-8', rowSpan: 'row-span-2' },
  { url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-6 md:col-span-4', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-6 md:col-span-4', rowSpan: 'row-span-1' },
  { url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop', colSpan: 'col-span-6 md:col-span-4', rowSpan: 'row-span-1' },
  { url: '/images/gallery-5.jpg', colSpan: 'col-span-6 md:col-span-8', rowSpan: 'row-span-1' },
];

export default function Gallery() {
  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-espresso mb-4">Glimpses of Ember & Bean</h2>
        </div>

        <div className="grid grid-cols-12 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`relative group rounded-[2rem] overflow-hidden ${img.colSpan} ${img.rowSpan} bg-cream shadow-sm`}
            >
              <img 
                src={img.url} 
                alt="Cafe Gallery Image" 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
