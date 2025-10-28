'use client'


import SocialMedia from "../header/social";
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import NewsletterDialog from "../header/newsletters";
import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
import dynamic from "next/dynamic";
import { useState } from "react";
import MailChecker from "mailchecker";
import validator from "validator";
import moment from 'moment';


const PartnerMenu = dynamic(
  () => import("./partnerMenu"),
  { 
    ssr: false,
  
  }
);



const Footer = () => {
  const router = useRouter(); // Initialize the router
  const locale = useLocale(); // Get the current locale
  const t = useTranslations('Footer');
  const te = useTranslations('Login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [email, setEmail] = useState("");

const isValidEmail = (email: string): { valid: boolean; message?: string } => {
  if (!email || email.trim() === "") {
    return { valid: false, message: te('Email-is-required') };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: te('Invalid-email-format') };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: te('Invalid-email-format') };
  }

  // remove MailChecker (not safe for client)
  return { valid: true };
};




  const handleSubscribe = async () => {
   const emailValidation = isValidEmail(email);

  if (!emailValidation.valid) {
    setError(emailValidation.message || te('Invalid-email'));
    return;
  }

  setError("");


    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // HH:mm:ss
    const language = "en";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}newsletterpost/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
        },
        body: JSON.stringify({
          email,
          language,
          date,
          time,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      const data = await response.json();
      setEmail(""); // clear input
      setSuccess(true)
    } catch (error) {
      console.error("Error:", error);
      setWrong(true)
    }
  };







    return (
        <footer className="bg-black text-gray-50 ">
        <div className="mx-6 md:mx-16 custom:mx-80 py-20 font-montserrat">
          <div className="grid  grid-cols-1 sm:grid-cols-2 custom:grid-cols-2 gap-10">
            {/* Contact & Follow Section */}
            <div className="col-span-1 hover:bg-gray-800 p-3">
             <div className="relative h-24 w-40 ">
                       <Image
                         src="/raciat-logo.webp" // or "/logo.webp" if using an webp
                         alt="logo"
                         fill
                         sizes='100%'
                         style={{ objectFit: 'contain' }} // Maintain aspect ratio
                         priority // Ensures it loads faster
                       />
                     </div>

            <div className="text-sm pt-4">
               <p>نهدف إلى أن نكون الخيار الأول للعملاء والمستثمرين في القطاع العقاري <br /> عبر تقديم مشاريع رائدة وحلول تمويلية متميزة.</p>
   
            
            </div>
           

        


            </div>
            <div className="hover:bg-yel p-3 flex flex-col justify-center">
            <h2 className="pb-4 font-semibold uppercase font-playfair">تابعنا</h2>
            <p className="text-sm 00 mb-3">كن جزءًا من مجتمع راسيات، وتابعنا على وسائل التواصل الاجتماعي</p>
             <SocialMedia/>
            </div>

            {/* Footer Text Spanning All Columns */}
        
          </div>
       
          <div className="grid  grid-cols-2 sm:grid-cols-2 custom:grid-cols-4 gap-10 pt-10 ">
                     {/* Information Section */}
                     <div className="col-span-1 hover:bg-bl hover:text-gray-900 p-3">
            <h2 className="pb-4 font-semibold uppercase font-playfair">تصفح الموقع</h2>
          <div className=" text-sm flex flex-col gap-3">
            <Link href="/"><p className=" hover:underline cursor-pointer">الصفحة الرئيسية</p></Link>
            <Link href="/blog"> <p className=" hover:underline cursor-pointer">المدونة</p></Link>
            <Link href="/about-us"><p className=" hover:underline cursor-pointer"> معلومات عنا</p></Link>
          

          </div>
             
            </div>

                      {/* Useful Links Section */}
                      <div className="col-span-1 hover:bg-secondary hover:text-gray-900 p-3">
            <h2 className="pb-4 font-semibold uppercase font-playfair">روابط مساعدة</h2>
            <div className=" text-sm flex flex-col gap-3">
            <Link href="/contact-us"><p className=" hover:underline cursor-pointer">اتصل بنا</p></Link>
            <Link href="/help-center"><p className=" hover:underline cursor-pointer">خدمة العملاء</p></Link>
            <Link href="/booking"> <p className=" hover:underline cursor-pointer">جميع العقارات</p></Link>
          
          
          </div>
          
            </div>
            {/* Information Section */}
            <div className="col-span-2 hover:bg-neutral  p-3">
              <div className="text-sm 00 py-3">
               <p>إشترك في نشرتنا الإخبارية لتصلك أحدث العروض والتخفيضات الحصرية مباشرة إلى بريدك الإلكتروني.</p>
   
            
            </div>
             <div className="w-full max-w-xs">
  <div className="flex items-center border-b border-gray-300 pb-1">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="إشترك ببريدك الإلكتروني"
      className="flex-grow outline-none px-2 py-1 w-full bg-transparent placeholder:text-white"
    />
    <button
      onClick={handleSubscribe}
      className="flex items-center hover:bg-accent"
    >
     <GoArrowRight size={28} className="text-white rotate-180" />

    </button>
  </div>
 {success && <p className="text-green-500 text-sm mt-2">شكرا ﻹشتراكك في نشرتنا اﻹخبارية</p>}
  {wrong && <p className="text-red-500 text-sm mt-2"> أعد المحاولة مرة أخرى رجاء</p>}
  {/* Error message below input */}
  {error && <p className="text-background text-sm mt-2">{error}</p>}
</div>
            </div>

            {/* Footer Text Spanning All Columns */}
        
          </div>
 
          </div>
          <hr className="text-white pt-10 mx-6 md:mx-16 custom:mx-72 "/>
      </footer>
      
    );
  };
  
  export default Footer;
  

  /**       <PartnerMenu/> */