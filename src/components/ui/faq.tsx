'use client';

import { useState } from 'react';


interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQAccordion = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);
const words = [
    {
      text: "Frequently",
    },
    {
      text: "Asked",
    },
       {
      text: "Questions",
      className: "text-[#ccac00] dark:text-[#ccac00]",
    }, 
  ];
const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'ما هي وكالة الاستثمار وما الخدمات التي تقدمها؟',
    answer:
      'وكالة الاستثمار هي جهة متخصصة في إدارة وتوجيه استثمارات الأفراد أو الشركات. تقدم خدمات مثل دراسة المشاريع، إدارة المحافظ الاستثمارية، تحليل الأسواق، وتقديم الاستشارات المالية لضمان تحقيق أفضل عائد ممكن بأقل قدر من المخاطر.'
  },
  {
    id: 2,
    question: 'لماذا أحتاج إلى وكالة استثمار لإدارة أموالي؟',
    answer:
      'لأن وكالات الاستثمار تمتلك خبرة ومعرفة عميقة في الأسواق المالية. فهي تساعدك على اتخاذ قرارات مدروسة، وتقلل من احتمالية الخسارة، وتعمل على تنويع استثماراتك بما يتناسب مع أهدافك المالية ومستوى المخاطرة الذي تفضله.'
  },
  {
    id: 3,
    question: 'هل يمكنني البدء بالاستثمار بمبلغ صغير؟',
    answer:
      'نعم، يمكن البدء بمبالغ صغيرة حسب نوع الاستثمار والخطة التي تقدمها الوكالة. الهدف هو بناء استراتيجية استثمارية طويلة المدى تتناسب مع قدراتك المالية وتنمو تدريجيًا مع الوقت.'
  },
  {
    id: 4,
    question: 'كيف تضمن وكالة الاستثمار الشفافية والمصداقية في التعامل؟',
    answer:
      'تلتزم الوكالة بتقديم تقارير دورية مفصلة حول أداء الاستثمارات، وتوضح جميع الرسوم والعوائد بوضوح تام. كما تعمل وفق سياسات رقابية وقانونية معترف بها لضمان الثقة الكاملة بين العميل والوكالة.'
  },
];


  const toggleItem = (id: number) => {
    setActiveItem(activeItem === id ? null : id);
  };

  return (
    <div className=" bg-primary flex justify-center items-center pb-40">
      <div className="max-w-7xl w-full">
        {/* Header */}
<div className='py-16 lg:py-24'>
     <p className='font-bold text-3xl text-white text-center'>اﻷسئلة الشائعة</p>
</div>


        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={item.id}
              className="transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 animate-fade-in-up"
              style={{
                animationDelay: `${(index + 1) * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* Question */}
              <button
                className="w-full px-6 py-6 text-right flex justify-between items-center cursor-pointer relative overflow-hidden"
                onClick={() => toggleItem(item.id)}
              >
                {/* Gradient left border */}
                <div 
                  className={`absolute left-0 top-0 h-full w-1 bg-secondary transition-transform duration-300 ${
                    activeItem === item.id ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />
                
                <h3 className=" text-lg md:text-xl lg:text-2xl font-medium text-white pr-4 flex-1 font-roboto">
                  {item.question}
                </h3>
                
                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-full bg-secondary
                  flex items-center justify-center transition-transform duration-300 flex-shrink-0
                  ${activeItem === item.id ? 'rotate-180' : ''}
                `}>
                  <div className="relative w-8 h-8">
                    <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-primary -translate-x-1/2 -translate-y-1/2" />
                    <div 
                      className={`
                        absolute top-1/2 left-1/2 w-0.5 h-3 bg-primary -translate-x-1/2 -translate-y-1/2 
                        transition-transform duration-300
                        ${activeItem === item.id ? 'rotate-90' : ''}
                      `}
                    />
                  </div>
                </div>
              </button>
<hr className='border-secondary'/>
              {/* Answer */}
              <div 
                className={`
                  overflow-hidden transition-all duration-400 bg-neutral
                  ${activeItem === item.id ? 'max-h-[600px]' : 'max-h-0'}
                `}
              >
                <div className="px-6 py-6 text-white leading-relaxed md:text-lg">
                 <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default FAQAccordion;