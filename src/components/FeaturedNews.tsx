import React from 'react';
import Image from 'next/image';
import newsData from '@/data/noticias.json';

const FEATURED_NEWS_IDS = [1, 2, 3]; 

export default function FeaturedNews() {
  const featuredNews = newsData.filter(news => FEATURED_NEWS_IDS.includes(news.id));

  return (
    <div className="py-16 bg-gradient-to-b from-[#F8FAFC] to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#0A4DA6] mb-12">
          Notícias em Destaque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredNews.map((news) => (
            <a
              key={news.id}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
                <div className="relative h-48 w-full">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#0A4DA6] transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {news.description}
                  </p>
                  <div className="mt-4 text-sm text-[#0A4DA6]">
                    Leia mais →
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
