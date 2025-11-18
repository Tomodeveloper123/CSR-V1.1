
import React, { useState, useEffect } from 'react';
import { getNews } from '../services/database';
import type { NewsArticle } from '../types';

const NewsCard: React.FC<{ news: NewsArticle }> = ({ news }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
        <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">{news.date}</p>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{news.title}</h3>
            <p className="text-gray-600 mb-4">{news.excerpt}</p>
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">Baca Selengkapnya &rarr;</a>
        </div>
    </div>
);

const NewsCardSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-300"></div>
        <div className="p-6">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
            <div className="h-5 bg-gray-300 rounded w-1/3"></div>
        </div>
    </div>
)

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
        try {
            const data = await getNews();
            setNews(data);
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchNews();
  }, []);

  return (
    <section className="py-12 md:py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Kegiatan CSR Terbaru</h2>
          <p className="text-gray-600 mt-2">Inisiatif dan dampak positif yang telah kami ciptakan untuk masyarakat.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <>
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </>
          ) : (
            news.map(item => (
              <NewsCard key={item.id} news={item} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
