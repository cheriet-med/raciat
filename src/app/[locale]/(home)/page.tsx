'use client'

import { useRef, useEffect, useState } from 'react';
import CombatLanding from "@/components/home-page/hero"
import ScrollAnimationGallery from "@/components/home-page/section3"
import CombinedScrollAnimation from "@/components/home-page/section4"
import ScrollAnimation from "@/components/home-page/section1"
import FullscreenSlider from "@/components/home-page/sectionTop"
import dynamic from 'next/dynamic'
import { InfiniteMovingCards } from '@/components/ui/infinite';
import { cn } from "@/lib/utils";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import Link from 'next/link';
import { InfiniteMovingCardsItems } from '@/components/ui/infinite-moving-cards-items';
import ExpandableCardDemo from '@/components/ui/experts';
import { MultiStepLoaderDemo } from '@/components/ui/text-anime';
import FAQAccordion from '@/components/ui/faq';
import HotelCardsHome from '@/components/ui/card-home-grid-2';
import ResCardsHome from '@/components/ui/card-home-grid-3';


  const testimonial = [
    {
      quote:
        "شكرًا للمستشار المبيعات، كان متعاونًا جدًا وقدم لي نصائح مهمة ساعدتني.",
      name: "محمد الحربي",
      designation: "مدير وكالة عقارية",
      src: "/asset/card-3.avif",
    },
    {
      quote:
        "كنت أبحث عن استثمار عقاري جيد، وقد قدم لي فريق الأقصر العديد من الخيارات المميزة بعد استشارة معمقة.",
      name: "فارس العنزي",
      designation: "مدير تنفيدي",
      src: "/asset/card-5.avif",
    },
    {
      quote:
        "تعاملتُ مع شركة رسيات الماسية لشراء منزلي الأول، وكانت التجربة رائعة بكل المقاييس. أشكرهم على احترافيتهم العالية وأوصي بهم بشدة.",
      name: "أحمد سعيد",
      designation: "مستشار تسويق",
      src: "/asset/card-6.avif",
    },
   
  ];
const VideoSection = dynamic(() => import('@/components/home-page/VideoSection'), { ssr: false })



export default function Home () {
 
 const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure autoplay works (muted is required for most browsers)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented:', err);
      });
    }
  }, []);



  return(
    <div>

      
<FullscreenSlider/>
<div className='bg-primary py-16 md:py-32'>
    <p className=' max-w-7xl mx-6 xl:mx-auto md:text-lg  lg:text-2xl  text-bl  text-center font-medium'>
     تأسست راسيات الماسية العقارية في عام 2002، وهي إحدى الجهات الرائدة في مجال <span className='text-secondary'>الاستثمار والتطوير العقاري</span>. منذ تأسيسها، عملت المؤسسة على تقديم حلول عقارية وتمويلية مبتكرة ومتكاملة تلبي احتياجات عملائها والمستثمرين.
     </p>
</div>


<div className='grid grid-cols-1 md:grid-cols-2'>
<div className='flex justify-center items-center p-12 lg:p-32 bg-secondary'>
<p className='text-primary font-medium text-lg md:text-2xl'>نسعى إلى تقديم حلول عقارية وتمويلية متميزة ومتكاملة من خلال تقديم مشاريع سكنية وتجارية مبتكرة، تلبي احتياجات السوق ، مع الالتزام بالجودة العالية والمعايير التي تعزز الثقة والشفافية. </p>
</div>
  <div >
   <MultiStepLoaderDemo/>
  </div>
</div>

<div className='bg-bl'>
    
           <h2 className='text-xl md:text-3xl lg:text-5xl text-primary  font-bold text-center pt-24 pb-4'>وسطاء راسيات الماسية – خبراء تثق بهم!</h2>
    <p className=' md:text-xl font-medium text-primary text-center px-4'>أفضل الوسطاء العقاريين لمساعدتك في بيع أو تأجير عقارك بأفضل العروض وأسرع وقت. تواصل مع الخبير المناسب الآن!</p>



 
  <ExpandableCardDemo/>
</div>


 <section className="relative h-[700px]">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        src="/section.mp4" // ✅ replace with your video path
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        //poster="/footer.jpg" // ✅ optional poster
      />
    </section>



<div className='bg-secondary relative' id='plan'>
     
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-primary"></div>
  <div className='relative z-20'>
  
   

  <AnimatedTestimonials testimonials={testimonial} />;

    
      </div>
</div>
<div className='bg-bl py-24'>
    
           <h2 className='text-3xl md:text-5xl text-primary  font-bold text-center  pb-4'>عقارات حديثة</h2>
    <p className='mx-auto md:text-xl font-medium text-primary text-center max-w-4xl pb-24 px-4'>نسعى إلى تقديم حلول عقارية وتمويلية متميزة ومتكاملة من خلال تقديم مشاريع سكنية وتجارية مبتكرة، تلبي احتياجات السوق ، مع الالتزام بالجودة العالية والمعايير التي تعزز الثقة والشفافية. </p>

<HotelCardsHome/>
<ResCardsHome/>
</div>






<FAQAccordion/>


     <div className=" flex flex-col antialiased bg-secondary items-center justify-center relative overflow-hidden">
    <InfiniteMovingCards
          items={imagess}
          direction="right"
          speed="fast"
          pauseOnHover={true}
        />
    </div>



    </div>
  )
}

   const imagess = [
    {
      image: "/logos/1.webp",
      alt: "Mountain landscape"
    },
    {
     image: "/logos/2.webp",
      alt: "Nature scene"
    },
    {
     image: "/logos/3.webp",
      alt: "Beautiful vista"
    },
    {
     image: "/logos/4.webp",
      alt: "Scenic view"
    },
    {
     image: "/logos/5.webp",
      alt: "Landscape photo"
    }
   
  ];

const testimonials = [
  {
    quote:
      "Every review is verified through a bill, booking, or payment. No fake feedback, no bots.",
    name: "",
    title: "Verified Travel Reviews",
  },
  {
    quote:
      "Our unique trust scores show you who’s reliable, based on real user interactions.",
    name: "",
    title: "Trust System",
  },
  {
    quote: "Book hotels and restaurants seamlessly—no middlemen, no hassle.",
    name: "",
    title: "Direct Hotel & Restaurant Booking",
  },
];



const testimonials1 = [
  {
    quote:
      "Our smart AI highlights key themes like service and cleanliness from real reviews.",
    name: "",
    title: "AI Review Summaries",
  },
  {
    quote:
      "Join a global community built on honesty, fairness, and unforgettable experiences.",
    name: "",
    title: "Community-Driven",
  },
  
  
];



const restaurants = [
  {
    quote:"New york, USA",
    name: "/assets/image-3.avif",
    title: "The Ivy Cottage, London",
     rating: 4.9,
  },
  {
   quote:"Banff, Canada",
    name: "/assets/image-5.avif",
    title: "The Highland Bistro, Edinburgh",
    rating: 4.8,
  },
  {
    quote:"Paris, France",
    name: "/assets/image-12.avif",
    title: "Cotswold Kitchen, Cotswolds",
    rating: 4.2,
  },
  
];


const hotels = [
  {
    quote:"Dubai, UAE",
    name: "/assets/image-11.avif",
    title: "Seaside Haven, Brighton",
    rating: 5,
  },
  {
   quote:"Sydney, Australia",
    name: "/assets/image-10.avif",
    title: "Lakeside Retreat, Windermere",
    rating: 4.5,
  },
  {
    quote:"Maldives",
    name: "/assets/image-7.avif",
    title: "Adventure Tours, Cornwall",
    rating: 4.8,
  },
];



/**
 * import dynamic from 'next/dynamic';
const CombatLanding = dynamic(() => import("@/components/home-page/hero"), {
  ssr: false,
});

const ScrollAnimation = dynamic(() => import("@/components/home-page/section1"), {
 ssr: false,
});

const CombinedScrollAnimation = dynamic(() => import("@/components/home-page/section4"), {
  ssr: false,
});

const ScrollAnimationGallery = dynamic(() => import("@/components/home-page/section3"), {
 ssr: false,
});






















   <div className=' flex gap-10 lg:gap-20 flex-wrap lg:flex-nowrap bg-a px-6 lg:px-60 py-20  lg:py-32 text-white '>
   <h2 className=' font-extratbold lg:flex-1 font-playfair uppercase text-3xl md:text-5xl font-bold'>Real Places, Real Reviews</h2>
        <h3 className='lg:flex-1 text-2xl md:text-4xl font-playfair'>Dive into trending restaurants and hotels, rated by real diners and travelers.

</h3>
</div>

<ScrollAnimationGallery/>

 <div className='flex gap-20 flex-wrap lg:flex-nowrap flex-col justify-center items-center px-6 lg:px-72 pt-36 pb-24 lg:pb-2 lg:pt-32 text-white bg-secondary ' >
  <h2 className='uppercase text-3xl md:text-5xl  font-bold flex-2 font-playfair text-center'>Skip the Fake, Trust the Verified

</h2>
    <h3 className=" mx-auto text-center text-2xl md:text-4xl font-playfair">
 No bots. No paid reviews. Every rating you see is backed by a receipt, booking, or visit.
We cut the noise — so you can nd real places people actually loved.
</h3>
</div> 
 
<CombinedScrollAnimation/>
<VideoSection/>












    <div className='py-16  text-white bg-secondary'>
           <h2 className='text-3xl md:text-5xl lg:text-7xl font-bold text-center font-playfair'>Discover a Featured Gem</h2>
    <p className=' md:text-xl font-medium text-center'>Explore our handpicked restaurants and hotels with exclusive offers and experiences</p>

 
    </div>
<div>

    
    <div className=" pt-8 rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
 
      <InfiniteMovingCardsItems
        items={restaurants}
        direction="right"
        speed="fast"
      />
    </div>
  <div className="pb-8  rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCardsItems
        items={hotels}
        direction="left"
        speed="fast"
      />
    </div>

</div>

<div className='relative flex justify-center py-16 bg-accent'>
 <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>  
  <Link href="/en/be-partner">
  
  <button
  className="px-6 md:px-12 py-4 rounded-md bg-black text-white text-sm md:text-xl  xl:text-3xl font-montserrat hover:bg-secondary font-medium"
>
  Join the new era of trusted Hospitality as Owner
</button>
</Link>
</div>

 */