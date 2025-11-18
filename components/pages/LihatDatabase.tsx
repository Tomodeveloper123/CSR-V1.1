import React, { useState, useEffect } from 'react';
import { getUsers, getSlides, getNews } from '../../services/database';
import type { User, Slide, NewsArticle } from '../../types';

const LihatDatabase: React.FC = () => {
    const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [usersData, slidesData, newsData] = await Promise.all([
                    getUsers(),
                    getSlides(),
                    getNews(),
                ]);
                setUsers(usersData);
                setSlides(slidesData);
                setNews(newsData);
            } catch (error) {
                console.error("Failed to fetch database data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Visualisasi Database</h1>
                <p className="text-gray-600">Memuat data...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Visualisasi Database</h1>
            
            {/* Users Table */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tabel Pengguna</h2>
                <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4">{user.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slides Table */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tabel Slide Gambar</h2>
                <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">URL Gambar</th>
                                <th scope="col" className="px-6 py-3">Judul</th>
                                <th scope="col" className="px-6 py-3">Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slides.map((slide, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <a href={slide.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate" style={{maxWidth: '200px', display: 'inline-block'}}>{slide.url}</a>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{slide.title}</td>
                                    <td className="px-6 py-4">{slide.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             {/* News Table */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tabel Artikel Berita</h2>
                <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Gambar</th>
                                <th scope="col" className="px-6 py-3">ID</th>
                                <th scope="col" className="px-6 py-3">Judul</th>
                                <th scope="col" className="px-6 py-3">Kutipan</th>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map(item => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded-md" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4">{item.excerpt}</td>
                                    <td className="px-6 py-4">{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default LihatDatabase;