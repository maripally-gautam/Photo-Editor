
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowsRightLeftIcon } from './icons';

interface ImageComparatorProps {
    before: string;
    after: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ before, after }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
    };

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        handleMove(e.clientX);
    }, [handleMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        handleMove(e.touches[0].clientX);
    }, [handleMove]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);


    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-full mx-auto aspect-square rounded-xl overflow-hidden select-none cursor-ew-resize shadow-lg"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {/* Before Image */}
            <div className="absolute inset-0">
                <img src={before} alt="Before" className="w-full h-full object-contain" draggable="false" />
                <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-semibold pointer-events-none">
                    Before
                </div>
            </div>

            {/* After Image (clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src={after} alt="After" className="w-full h-full object-contain" draggable="false" />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-semibold pointer-events-none">
                    After
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/80 pointer-events-none"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 bg-white/80 rounded-full flex items-center justify-center shadow-md">
                   <ArrowsRightLeftIcon className="w-6 h-6 text-gray-800" />
                </div>
            </div>
        </div>
    );
};
