'use client'
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { LuHotel } from "react-icons/lu";
import { RiChatSmileAiLine } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import LoginButtonLiveChat from '@/components/header/loginButtonLiveChatContactPage';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });
import moment from 'moment';
interface ContactInfo {
  icon: any;
  title: string;
  details: string[];
  color: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject:string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject:'',
    message: '',
  });

   const hotelMarkers = [{
    position: [ 51.505,  -0.09] as [number, number],
  }];

  const centerPosition = 
    [ 51.505, -0.09] as [number, number];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const contactInfo: ContactInfo[] = [
    {
      icon: <FaPhone size={54} className='text-secondary'/>,
      title: 'رقم الهاتف',
      details: ['966547029710', ],
      color: 'text-accent',
    },
    {
      icon: <MdEmail size={54} className='text-secondary'/>,
      title: 'البريد اﻹلكتروني',
      details: ['info@raciat.com'],
      color: 'text-primary',
    },
    {
      icon: <FaMapMarkerAlt size={54} className='text-secondary'/>,
      title: 'موقعنا الجغرافي',
      details: ['شجاع بن وهب، عبدالرحمن السديري، جدة 23436', ' المملكة العربية السعودية'],
      color: 'text-accent',
    },
    {
      icon: <FaClock size={54} className='text-secondary'/>,
      title: 'ساعات العمل',
      details: ['Monday To Saturday', '09:00 AM To 06:00 PM'],
      color: 'text-primary',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any previous messages when user starts typing
    if (submitMessage) {
      setSubmitMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Prepare the data to send
      const dataToSend = {
       
        full_name: formData.firstName,
        email: formData.email,
        company: formData.phone, // Note: your form uses 'phone' field for company name
        message: formData.message,
        subject: formData.subject,
        //category:"inbox",
        // Add any additional fields your API expects
        //timestamp: new Date().toISOString(),
        date:moment().format('MMMM Do YYYY'),
        time:moment().format('LTS'),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}emailletterpost/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Token " + process.env.NEXT_PUBLIC_TOKEN,
          // Add any additional headers your API requires
          // 'Authorization': `Bearer ${token}`, // if authentication is needed
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Form submitted successfully:', result);
        
        // Show success message
        setSubmitMessage({
          type: 'success',
          text: 'Your message has been sent successfully! We\'ll get back to you soon.'
        });

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          subject:'',
        });
      } else {
        const errorData = await response.json();
        console.error('Form submission failed:', errorData);
        
        setSubmitMessage({
          type: 'error',
          text: errorData.message || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="relative isolate bg-[url('/bg/12.webp')] bg-no-repeat bg-center bg-cover overflow-auto font-montserrat">
      {/* Header Section */}
      <div>
        <div className="flex flex-col px-4 text-center items-center justify-center  lg:mb-14 bg-yel h:96 lg:h-60 pt-40 pb-16  lg:pt-16 rounded-b-3xl text-bl opacity-90">

        </div>
      </div>

      <div className=" mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
          

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="shadow-sm hover:shadow-lg bg-bl rounded-xl transition-all duration-300 border-0  opacity-95">
                  <div className="p-6 h-72 flex justify-center items-center">
                    <div className="flex flex-col gap-4 text-center items-center justify-center">
                      
                      {info.icon}
                      
                      
                      <div className="flex-1">
                        <h3 className="text-lg text-gray-800 mb-2 font-playfair uppercase font-bold">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className=" text-gray-500">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            { status === "authenticated" ?       
                        
                          <button
                            
                            onClick={()=>router.push(`/en/account/messages/?id=10`)}
                            className="p-1 flex gap-4 justify-center items-center bg-primary w-full h-16 text-yel rounded-lg shadow-lg hover:bg-yel transition-all bg-opacity-95 border border-spacing-1 border-bl"
                          >
                            <RiChatSmileAiLine size={32} className='text-bl '/>
                           <p className='text-bl font-bold'>الدردشة المباشرة</p>
                           
                          </button>
                       
                      :  <LoginButtonLiveChat/> }
            
          </div>

          {/* Contact Form */}
          <div className="bg-bl rounded-2xl lg:p-8 shadow-sm  opacity-95">
            <div className="bg-secondary backdrop-blur-sm rounded-xl p-8">
              <h2 className="text-xl md:text-3xl font-bold text-bl mb-6 font-playfair">أرسل لنا رسالة من خلال ملئ اﻹستمارة</h2>
              
              {/* Success/Error Message */}
              {submitMessage && (
                <div className={`mb-4 ${
                  submitMessage.type === 'success' 
                    ? 'text-bl' 
                    : 'text-background'
                }`}>
                  <p className="text-sm font-medium">{submitMessage.text}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 items-center">
                    <label htmlFor="firstName" className="text-sm font-medium text-bl">
                      اﻹسم الكامل
                    </label>
                    <div className="relative">
                      
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pr-4 h-12 w-full rounded-lg"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                  
                  </div>
                  
                 <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-bl">
                     الشركة أو اﻹسم التجاري
                    </label>
                    <div className="relative">
                      
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pr-4 h-12 w-full rounded-lg"
                        placeholder="أدخل اسم شركتك"
                      />
                    </div>
                   
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                 
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-bl">
                     البريد اﻹلكتروني
                    </label>
                    <div className="relative">
                      
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pr-4 h-12 w-full rounded-lg"
                        placeholder="أدخل عنوان بريدك الإلكتروني"
                      />
                    </div>
                   
                  </div>

                                   <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-bl">
                     Subject
                    </label>
                    <div className="relative">
                      
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="pr-4 h-12 w-full rounded-lg"
                        placeholder="أدخل الموضوع"
                      />
                    </div>
                  
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-bl">
                  الرسالة
                  </label>
                  <div className="relative">
                   
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="pr-4 pt-3 resize-none w-full rounded-lg"
                      placeholder="أخبرنا عن مشروعك أو اسألنا عن أي شيء..."
                    />
                  </div>
              
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg font-semibold bg-primary hover:bg-yel transition-colors duration-200 text-gray-200 flex text-center justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary-bl border-t-transparent rounded-full animate-spin" />
                      <span>إرسال...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4 ">
                      <Send className="h-5 w-5 ml-4" />
                      <span>أرسل رسالة</span>
                    </div>
                  )}
                </button>
              </form>

              <p className="text-xs text-bl mt-4 text-center opacity-80">
جميع الحقول اختيارية. نحن نحترم خصوصيتك ولن نشارك معلوماتك أبدًا.
        </p>
            </div>
          </div>
        </div>
      </div>


        <div className="rounded-2xl m-1 sm:m-2 md:m-3 relative">
          <Map
            center={centerPosition}
            zoom={9}
            height="400px"
            markers={hotelMarkers}
          />
        </div>

    </div>
  );
};

export default ContactPage;