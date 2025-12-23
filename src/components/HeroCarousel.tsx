'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Slide {
  _id: string;
  imageUrl: string;
  title?: string;
}

interface HeroCarouselProps {
  slides?: Slide[];
}

export default function HeroCarousel({ slides = [] }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  // Default placeholder slides if no slides provided
  const defaultSlides: Slide[] = [
    { _id: '1', imageUrl: '/placeholder1.jpg', title: 'Slide 1' },
    { _id: '2', imageUrl: '/placeholder2.jpg', title: 'Slide 2' },
    { _id: '3', imageUrl: '/placeholder3.jpg', title: 'Slide 3' },
    { _id: '4', imageUrl: '/placeholder4.jpg', title: 'Slide 4' },
    { _id: '5', imageUrl: '/placeholder5.jpg', title: 'Slide 5' },
  ];

  const displaySlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displaySlides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, displaySlides.length]);

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const totalSlides = displaySlides.length;
    
    // Handle wrap-around
    let normalizedDiff = diff;
    if (diff > totalSlides / 2) normalizedDiff = diff - totalSlides;
    if (diff < -totalSlides / 2) normalizedDiff = diff + totalSlides;

    const absDistance = Math.abs(normalizedDiff);
    
    // Calculate position and transforms
    const translateX = normalizedDiff * 120;
    const translateZ = -absDistance * 100;
    const rotateY = normalizedDiff * -15;
    const scale = 1 - absDistance * 0.15;
    const opacity = 1 - absDistance * 0.3;
    const zIndex = 10 - absDistance;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: Math.max(opacity, 0.3),
      zIndex,
      filter: absDistance > 0 ? `grayscale(${absDistance * 40}%)` : 'none',
    };
  };

  return (
    <div 
      className="relative w-full h-[400px] flex items-center justify-center perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
        {displaySlides.map((slide, index) => (
          <div
            key={slide._id}
            className="absolute w-[200px] h-[280px] cursor-pointer transition-all duration-500 ease-out"
            style={getCardStyle(index)}
            onClick={() => setActiveIndex(index)}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
              {slide.imageUrl.startsWith('/placeholder') ? (
                <div className="w-full h-full bg-gradient-to-br from-cyber-red/30 to-gray-800 flex items-center justify-center">
                  <span className="text-white/50 text-sm">Image {index + 1}</span>
                </div>
              ) : (
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || `Slide ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              {slide.title && (
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-medium truncate">{slide.title}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {displaySlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-cyber-red w-6' : 'bg-white/50 hover:bg-white/80'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
