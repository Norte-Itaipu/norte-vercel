import newsData from '../data/noticias.json';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  date: string;
  link: string;
}

export default function NewsSectionLocal() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-24 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Últimas Notícias</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(newsData as NewsItem[]).map((item) => (
          <a href={item.link} target="_blank" rel="noopener noreferrer" key={item.id} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">{item.description}</p>
                {isClient && (
                  <span className="inline-block mt-3 text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}