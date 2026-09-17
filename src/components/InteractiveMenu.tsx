import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Category = 'All' | 'Coffee' | 'Breakfast' | 'Pastries' | 'Cold Drinks';

const menuItems = [
  { id: 1, name: 'Honey Cinnamon Cappuccino', desc: 'Espresso, steamed milk, local honey, dusting of Ceylon cinnamon.', price: '$5.50', category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop', popular: true },
  { id: 2, name: 'Pour Over', desc: 'Rotating selection of single-origin beans, brewed to order.', price: '$4.50', category: 'Coffee', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Citrus Ricotta Pancakes', desc: 'Fluffy pancakes, lemon zest, whipped ricotta, maple syrup.', price: '$14.00', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1528669826296-bdc7ebf061dc?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Avocado Tartine', desc: 'Smashed avocado, pickled red onions, radish, microgreens, sourdough.', price: '$11.00', category: 'Breakfast', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=800&auto=format&fit=crop', popular: true },
  { id: 5, name: 'Almond Croissant', desc: 'Classic buttery croissant filled and topped with almond frangipane.', price: '$5.00', category: 'Pastries', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop' },
  { id: 6, name: 'Iced Matcha Latte', desc: 'Ceremonial grade matcha, vanilla syrup, oat milk.', price: '$6.00', category: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop', popular: true },
  { id: 7, name: 'Cold Brew', desc: 'Steeped for 18 hours, smooth and bold.', price: '$4.50', category: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1461023058943-07cb12437e96?q=80&w=800&auto=format&fit=crop' },
  { id: 8, name: 'Cardamom Bun', desc: 'Swedish-style knotted bun with freshly ground cardamom.', price: '$4.50', category: 'Pastries', image: 'https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?q=80&w=800&auto=format&fit=crop' },
];

export default function InteractiveMenu() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const categories: Category[] = ['All', 'Coffee', 'Breakfast', 'Pastries', 'Cold Drinks'];

  const filteredItems = menuItems.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <section id="menu" className="pt-16 pb-24 bg-ivory relative">
      {/* Mobile Sticky Breadcrumb */}
      <div className={`md:hidden sticky top-[72px] z-30 w-full bg-ivory/95 backdrop-blur-md py-3 px-6 shadow-sm border-b border-espresso/5 mb-8 -mt-8 transition-all duration-300 ${activeCategory !== 'All' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center text-sm font-medium">
          <span className="text-espresso/50">Menu</span>
          <span className="mx-2 text-espresso/30">/</span>
          <span className="text-terracotta">{activeCategory}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-espresso mb-6">Our Menu</h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-espresso text-ivory shadow-md'
                    : 'bg-cream text-espresso hover:bg-espresso/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-cream">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.popular && (
                    <div className="absolute top-3 right-3 bg-ivory/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-terracotta uppercase tracking-wider">
                      Popular
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-serif text-lg text-espresso font-medium pr-4">{item.name}</h3>
                  <span className="font-medium text-terracotta shrink-0">{item.price}</span>
                </div>
                <p className="text-sm text-espresso/60 flex-grow">{item.desc}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
