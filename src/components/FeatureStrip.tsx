import { Coffee, Sun, Clock, MapPin } from 'lucide-react';

export default function FeatureStrip() {
  const features = [
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Specialty Coffee',
      desc: 'Single-origin beans and carefully crafted espresso.',
    },
    {
      icon: <Sun className="w-6 h-6" />,
      title: 'Fresh Every Morning',
      desc: 'Breakfast, pastries, and café favorites prepared daily.',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'A Place to Stay',
      desc: 'Comfortable spaces for conversations, work, and slow afternoons.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Open Daily',
      desc: '7:00 AM — 10:00 PM',
    },
  ];

  return (
    <section className="bg-espresso text-ivory py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y md:divide-y-0 lg:divide-x divide-ivory/10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center text-center ${
                idx !== 0 ? 'pt-8 md:pt-0 lg:px-8' : 'lg:pr-8'
              }`}
            >
              <div className="text-terracotta mb-4">{feature.icon}</div>
              <h3 className="font-serif text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-ivory/70 leading-relaxed max-w-[250px]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
