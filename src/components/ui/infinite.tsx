"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className = "",
}: {
  items: {
    image: string;
    alt?: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef<number>(0);

  useEffect(() => {
    if (!scrollerRef.current) return;

    // Duplicate items for seamless loop
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicatedItem);
    });

    const speedMap = {
      fast: 1,
      normal: 0.5,
      slow: 0.25,
    };

    const pixelsPerFrame = speedMap[speed];
    const directionMultiplier = direction === "left" ? -1 : 1;

    const animate = () => {
      if (!scrollerRef.current || isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      positionRef.current += pixelsPerFrame * directionMultiplier;

      // Get the width of one set of items
      const firstChild = scrollerRef.current.children[0] as HTMLElement;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth;
        const gap = 64; // 16 * 4 = 64px (gap-16 in Tailwind)
        const oneSetWidth = (itemWidth + gap) * items.length;

        // Reset position when one full set has scrolled
        if (direction === "left" && positionRef.current <= -oneSetWidth) {
          positionRef.current += oneSetWidth;
        } else if (direction === "right" && positionRef.current >= oneSetWidth) {
          positionRef.current -= oneSetWidth;
        }
      }

      scrollerRef.current.style.transform = `translateX(${positionRef.current}px)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [items.length, speed, direction, isPaused]);

  return (
    <div
      className={`scroller relative z-20 w-full overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <ul
        ref={scrollerRef}
        className="flex w-max min-w-full shrink-0 flex-nowrap gap-16 py-4"
        style={{ willChange: 'transform' }}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[200px] h-40 shrink-0 rounded-2xl overflow-hidden"
            key={`${item.image}-${idx}`}
          >
            <Image
              src={item.image}
              alt={item.alt || `Image ${idx + 1}`}
              fill
              className="object-contain"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};