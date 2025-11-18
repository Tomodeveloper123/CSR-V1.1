
import React, { useState, useEffect, useCallback } from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { getSlides } from '../services/database';
import type { Slide } from '../types';

const ImageSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
        try {
            const data = await getSlides();
            setSlides(data);
        } catch (error) {
            console.error("Failed to fetch slides:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchSlides();
  }, []);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    if (slides.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [nextSlide, slides.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (loading) {
      return (
          <div className="h-[500px] w-full flex items-center justify-center bg-gray-200 animate-pulse">
              <p className="text-gray-500">Memuat slide...</p>
          </div>
      );
  }

  if (slides.length === 0) {
      return (
          <div className="h-[500px] w-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-600">Tidak ada gambar untuk ditampilkan.</p>
          </div>
      );
  }

  return (
    <div className="h-[500px] w-full m-auto relative group">
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className="w-full h-full bg-center bg-cover duration-500"
      >
        <div className="w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-40 text-white p-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center animate-fade-in-down">{slides[currentIndex].title}</h2>
            <p className="text-lg md:text-xl text-center animate-fade-in-up">{slides[currentIndex].description}</p>
        </div>
      </div>
      
      {slides.length > 1 && (
        <>
            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <button onClick={prevSlide} aria-label="Previous Slide">
                <ChevronLeftIcon />
                </button>
            </div>
            
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                <button onClick={nextSlide} aria-label="Next Slide">
                <ChevronRightIcon />
                </button>
            </div>

            <div className="flex top-4 justify-center py-2 absolute bottom-5 w-full">
                {slides.map((slide, slideIndex) => (
                <div
                    key={slideIndex}
                    onClick={() => goToSlide(slideIndex)}
                    className={`text-2xl cursor-pointer mx-1 ${currentIndex === slideIndex ? 'text-white' : 'text-gray-400'}`}
                >
                    ●
                </div>
                ))}
            </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
