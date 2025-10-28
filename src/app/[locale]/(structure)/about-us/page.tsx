import React from "react";

import Image from "next/image";


export default function About () {
  return (
    <>
    <div className="flex items-center px-24   bg-yel h-60 pt-28 "></div>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
 
            <div className="bg-bl  px-6 space-y-10 pb-16">
<h2 className='text-2xl md:text-4xl text-primary  font-bold text-center pt-24 pb-4'>
خبرة عقارية راسخة وتميّز في تنفيذ المشاريع
</h2>
 <p className=' md:text-xl font-medium text-primary '>تتميز راسيات الماسية بفريق عمل ذو خبرة عالية في مجال العقارات، مما يساعدها على تنفيذ مشاريع ضخمة وناجحة في مختلف القطاعات العقارية. ومن خلال الابتكار في التصميم، الجودة في التنفيذ، والاهتمام بالتفاصيل، تواصل المؤسسة تحقيق نجاحات متميزة، مما يعزز مكانتها في السوق ويعكس التزامها بتوفير أفضل الحلول العقارية المتكاملة.</p>
 <p className=' md:text-xl font-medium text-primary '>تركز راسيات الماسية على تطوير المشاريع ، وتوفير خدمات عقارية وتمويلية شاملة من بيع، تأجير، واستشارات عقارية، مما يجعلها وجهة موثوقة للعملاء والمستثمرين.تتمتع راسيات الماسية بسمعة قوية في السوق، وذلك بفضل تنفيذها لمشاريع عقارية ناجحة تجمع بين التصميم العصري والاحتياجات المستقبلية.</p>    
 <p className=' md:text-xl font-medium text-primary '>
إن مستقبل راسيات الماسية العقارية يتجه نحو النمو المستدام، الابتكار المستمر، وتقديم مشاريع عقارية متكاملة تعزز من مكانتها في السوق وتواكب التغيرات المستقبلية. 
</p>


            </div>
       <div className="relative bg-primary h-96 lg:h-full w-full">
  <Image
    src="/bg/13.webp" // ✅ replace with your image path
    alt="Background"
    fill
    className="object-cover"
    priority
  />
 

</div>

                 <div className="relative bg-primary h-96 lg:h-full w-full">
  <Image
    src="/bg/19.webp" // ✅ replace with your image path
    alt="Background"
    fill
    className="object-cover"
    priority
  />
 

</div>

          <div className="bg-neutral  px-6 py-56">

 <p className=' md:text-xl font-medium text-bl '>متخصصون في تقديم حلول مبتكرة وفعّالة في مجال التسويق و التطوير العقاري بمفهوم حديث وعصري. يساهم في تغيير المشهد الاسكاني في المملكة العربية السعودية بشكل كبير من خلال تقديم الخدمات الاسكانية والحلول التمويلية للمساهمة في بيئات حضارية حديثة ومتناغمة، بشكل يحقق الرفاهية والاستقرار للمواطن و المقيم ، الذين نعدهم جوهر إلهامنا وأساس نجاحنا .</p>


            </div>

        </div>
    </>
  );
};


