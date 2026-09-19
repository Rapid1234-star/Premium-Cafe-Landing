import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah M.',
    initials: 'SM',
    image: 'https://i.pravatar.cc/150?u=sarah',
    text: "The absolute best pour-over I've had in the city. The space is gorgeous and the staff actually takes the time to explain the flavor profiles.",
    rating: 5,
    highlight: true,
  },
  {
    name: 'James T.',
    initials: 'JT',
    image: 'https://i.pravatar.cc/150?u=james',
    text: "My go-to spot for deep work. The Wi-Fi is rock solid, the playlists are great, and the Pistachio Croissant is dangerously good.",
    rating: 5,
    highlight: false,
  },
  {
    name: 'Elena R.',
    initials: 'ER',
    image: 'https://i.pravatar.cc/150?u=elena',
    text: "Such a warm, inviting atmosphere. You don't feel rushed here. It really feels like a neighborhood living room.",
    rating: 5,
    highlight: false,
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Left: Overall Rating */}
          <div className="w-full md:w-1/3 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl text-espresso mb-6">Good Coffee.<br/>Good Words.</h2>
              <div className="flex items-end gap-4 mb-4">
                <div className="text-6xl font-serif text-espresso leading-none">4.9</div>
                <div className="pb-1">
                  <div className="flex text-terracotta mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <div className="text-sm text-espresso/60 font-medium">Based on 500+ visits</div>
                </div>
              </div>
              <p className="text-espresso/70 mt-6 max-w-sm">
                We're incredibly grateful for the community that has grown around our café. Here is what they have to say.
              </p>
            </motion.div>
          </div>

          {/* Right: Review Cards */}
          <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className={`p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  review.highlight 
                    ? 'bg-espresso text-ivory md:col-span-2' 
                    : 'bg-ivory text-espresso shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className={`w-14 h-14 rounded-full object-cover shadow-sm border-2 ${
                      review.highlight ? 'border-ivory/20' : 'border-espresso/10'
                    }`}
                  />
                  <div>
                    <div className="font-medium">{review.name}</div>
                    <div className="flex text-terracotta mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`text-lg leading-relaxed ${review.highlight ? 'text-ivory/90' : 'text-espresso/80'}`}>
                  "{review.text}"
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
