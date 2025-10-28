
import { HoverEffect } from "@/components/ui/blog-cards"

export default function Blog () {


    return (
        <>
        <div className="flex items-center px-24  bg-primary h-60 pt-28 rounded-b-3xl"></div>
     <div className="mx-2 md:mx-8">

           <HoverEffect items={projects} />
     </div>
   


        </>
    )
}


const projects = [
  {
    title: "كيف تبني وكالة استثمار ناجحة من البداية إلى القمة",
    description:
      "دليل شامل لتأسيس وكالة استثمار قوية من التخطيط إلى تحقيق الأرباح المستدامة في الأسواق المحلية والعالمية.",
    link: "/ar/blog/1",
    image: "/bg/6.jpg",
  },
  {
    title: "استراتيجيات التسويق الذكي لجذب المستثمرين في عام 2025",
    description:
      "تعرف على أحدث أساليب التسويق الرقمي لبناء ثقة المستثمرين وتعزيز سمعة وكالتك الاستثمارية.",
    link: "/ar/blog/2",
    image: "/bg/7.jpg",
  },
  {
    title: "أسرار إدارة المحافظ الاستثمارية باحترافية عالية",
    description:
      "نصائح عملية لإدارة الأصول والاستثمارات بذكاء وتحقيق نمو مستدام في بيئة اقتصادية متغيرة.",
    link: "/ar/blog/3",
    image: "/bg/8.jpg",
  },
  {
    title: "من الفكرة إلى النجاح: خارطة طريق لبناء وكالة استثمار عصرية",
    description:
      "خطوات مدروسة لتأسيس وكالة استثمار تعتمد على الابتكار والتكنولوجيا لخدمة العملاء بكفاءة.",
    link: "/ar/blog/4",
    image: "/bg/9.jpg",
  },
];
