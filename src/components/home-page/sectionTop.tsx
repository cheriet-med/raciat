import { useState, useEffect, useCallback , lazy} from 'react';
import { MdOutlineHotel } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdVerifiedUser } from "react-icons/md";
import { FaShieldHalved } from "react-icons/fa6";
import Image from 'next/image';

const HotelSearchHomepage = lazy(() => import('@/components/header/searchHotelforHomepage'));
const RestaurantSearch = lazy(() => import("@/components/header/SearchRestaurant"));
const slides = [
  { id: 1, src: "/bg/9.webp", alt: "Slide 1" },
  { id: 2, src: "/bg/7.webp", alt: "Slide 2" },
  { id: 3, src: "/bg/17.webp", alt: "Slide 3" },
];

export default function FullscreenSlider() {
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"hotels" | "restaurants">("hotels");
  const [isVisible, setIsVisible] = useState(false);

  // Auto-change every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = useCallback((tab: "hotels" | "restaurants") => {
    setActiveTab(tab);
  }, []);



  return (
    <div className="relative w-full h-[700px] max-w-full">
      {/* Preload all images for better performance */}
<div className="hidden">
  {slides.map((slide) => (
    <Image
      key={slide.id}
      src={slide.src}
      alt={slide.alt}
      width={1920}
      height={1080}
      priority
    />
  ))}
</div>
      
      {/* Simple image display without animations */}

<div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-black">
  <div
    key={slides[index].id}
    className="absolute top-0 left-0 w-full h-full animate-zoomInFade"
    style={{ transformOrigin: "center center" }}
  >
    <Image
      src={slides[index].src}
      alt={slides[index].alt}
      fill
      sizes="100vw"
      className="object-cover"
      priority
    />
  </div>

  <style jsx>{`
    @keyframes zoomInFade {
      0% {
        transform: scale(1);
        opacity: 0.4;
      }
      10% {
        opacity: 1;
      }
      100% {
        transform: scale(1.1);
        opacity: 1;
      }
    }
    .animate-zoomInFade {
      animation: zoomInFade 10s ease-out forwards;
    }
  `}</style>
</div>

   <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-primary"></div>
      {/* Overlay content */}
      <div className="absolute mt-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 flex flex-col justify-center items-center space-y-2 z-30">
        {/* Title */}
        <h1 className="text-center uppercase text-2xl md:text-4xl lg:text-7xl leading-tight text-bl  font-Tajawal font-extrabold pb-2 max-w-full">
       
            راسيات الماسية العقارية
        
        </h1>
        
   

      
        
        <div className='w-full md:pt-4 max-w-full '>
             <HotelSearchHomepage /> 
        </div>
      </div>
      


      {/* Slider dots */}
      <div className="absolute bottom-6 w-full flex justify-center gap-2">
         {slides.map((slide, i) => (
    <button
      key={i}
      onClick={() => setIndex(i)}
      aria-label={`Go to slide ${i + 1}: ${slide.alt}`} 
      title={`Go to slide ${i + 1}`} // optional tooltip
      className={`w-20 h-1 rounded-full ${
        i === index ? "bg-white" : "bg-white/50"
      }`}
    />
  ))}
      </div>
    </div>
  );
}



/**
 * 
 *       <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-full lg:px-24 gap-2 md:gap-6 z-30 justify-center md:justify-between px-4 md:px-8 flex-wrap hidden xl:flex">
        <div className="flex items-center gap-2">
          <MdVerified className="text-white h-5 w-5 md:h-6 md:w-6" />
          <span className="text-white text:xs md:text-lg font-playfair md:font-bold">حلول مبتكرة</span>
        </div>

        <div className="flex items-center gap-2">
          <FaShieldHalved className="text-white h-5 w-5 md:h-6 md:w-6" />
          <span className="text-white text:xs md:text-lg font-playfair md:font-bold">إستثمار عقاري</span>
        </div>
      </div>
 */