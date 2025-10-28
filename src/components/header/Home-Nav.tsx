'use client';

import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { useLocale } from "next-intl";
import { useState , useEffect} from 'react';
import Image from "next/image";
import CircularMenuWrapper from "../CircularMenuWrapper";
import { FaUserAstronaut } from "react-icons/fa";
import { Link } from "@/i18n/routing";
import { MdContactless } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import { IoIosHome } from "react-icons/io";
import { FaBuilding } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { TiInfoLarge } from "react-icons/ti";
import { SiInformatica } from "react-icons/si";
import { SiMicrodotblog } from "react-icons/si";

import dynamic from 'next/dynamic';
//const CircularMenuWrapper = dynamic(() => import("../CircularMenuWrapper"), {
//  ssr: false,
//});
//const CircularMenu = dynamic(
//  () => import("../CircularMenu"),
//  { 
//    ssr: false,
//  }
//);

export default function HomeNav() {
  const te = useTranslations('tophero');
  const { data: session, status } = useSession();
  const l = useLocale();
  const [isHovered, setIsHovered] = useState(false);

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show only when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } 
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);



  return (
    <header 
    className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? '' : '-translate-y-full'
      }`}
  >
      <div className="mx-6 md:mx-16 custom:mx-16 py-10 "
     
      >
     <nav 
          className={`flex items-center justify-between py-3 w-full px-5 rounded-lg transition-all duration-300 ${
            isHovered ? '' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Global"
        >
           <div className="hidden  text-white xl:flex gap-5 ">
            <Link href="/">
          <div className="flex gap-2 font-semibold items-center hover:text-secondary hover:underline cursor-pointer">
            <IoIosHome size={18}/>
             <p>الرئيسية</p>
          </div></Link>
          <Link href="/booking">
             <div className="flex gap-2 font-semibold items-center hover:text-secondary hover:underline cursor-pointer">
            <FaBuilding size={18}/>
              <p>عقارات</p>
              </div></Link>
              <Link href="/about-us">
            <div className="flex gap-2 font-semibold items-center hover:text-secondary hover:underline cursor-pointer">
              <SiInformatica size={18}/>
               <p>معلومات عنا</p>
               </div></Link>
               <Link href="/blog">
            <div className="flex gap-2 font-semibold items-center hover:text-secondary hover:underline cursor-pointer">
               <SiMicrodotblog size={18}/>
                <p>مدونة</p>
                </div></Link>
          </div>
         
            <div className="col-span-1">
<Link href="/">
<div className="relative h-20 w-48 sm:h-24 sm:w-64 lg:h-32 lg:w-80">
  <Image
    src="/raciat-logo.webp"
    alt="logo"
    fill
    sizes="100%"
    style={{ objectFit: 'contain' }}
    priority
  />
</div>
       </Link>
       </div>
      
      <div className="flex xl:hidden">
 <CircularMenuWrapper/>
      </div>
      <div className="hidden  xl:flex gap-5 text-white font-bold ">
        
        <div className="w-28"></div>
        <Link href="/contact-us">
                <div className="border border-white px-8 py-2 rounded-3xl flex gap-2 justify-between items-center hover:bg-secondary cursor-pointer">
          <RiContactsFill size={18}/>
          <p>إتصل بنا</p>
        </div></Link>
        <Link href="/login">
        <div className="border border-white px-8 py-2 rounded-3xl flex gap-2 justify-between items-center hover:bg-secondary cursor-pointer bg-primary">
        <FaUserAstronaut size={18}/>  
        <p>حسابي</p>
      
        </div>
        </Link>

      </div>
      
        </nav>
      </div>
    
    </header>
  );
}


/***bg-primary bg-opacity-20 shadow-sm */