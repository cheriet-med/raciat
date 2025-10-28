"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Fixed outside click hook with proper typing
function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className=" py-20">
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-secondary dark:bg-bl sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={800}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-[450px] sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="text-neutral-700 dark:text-neutral-200 text-xl font-bold"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>


                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto px-4 xl:px-32 w-full grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 items-start gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-2 flex flex-col bg-white dark:bg-neutral-800 hover:bg-secondary dark:hover:bg-neutral-700 rounded-xl cursor-pointer transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex gap-4 flex-col w-full">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={500}
                  src={card.src}
                  alt={card.title}
                  className="h-96 w-full rounded-lg object-cover object-top text-primary"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-bold  dark:text-neutral-200 text-center md:text-left text-lg text-primary"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-center md:text-left text-base text-primary"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: " مستشارة مبيعات عقارية , راسيات الماسية العقارية",
    title: "ريم",
    src: "/asset/card-1.avif",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
        <div>
        <p>
          ريم، مستشارة عقارية متميزة بخبرة واسعة في مجال الخدمات العقارية والمبيعات. أمتلك رؤية استراتيجية وقدرة على تقديم استشارات مخصصة لتحقيق أفضل النتائج لعملائنا. أتميز بالاهتمام بأدق التفاصيل لضمان تجربة سلسة وناجحة في كل معاملة عقارية.
        </p>

        <p>اللغة: العربية</p>
        <p>مناطق الخدمة : المملكة العربية السعودية ، جدة</p>
        </div>

      );
    },
  },
  {
    description: "مستشارة مبيعات عقارية , راسيات الماسية العقارية ",
    title: "مها",
    src: "/asset/card-6.avif",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
  <div>
        <p>
          ريم، مستشارة عقارية متميزة بخبرة واسعة في مجال الخدمات العقارية والمبيعات. أمتلك رؤية استراتيجية وقدرة على تقديم استشارات مخصصة لتحقيق أفضل النتائج لعملائنا. أتميز بالاهتمام بأدق التفاصيل لضمان تجربة سلسة وناجحة في كل معاملة عقارية.
        </p>

        <p>اللغة: العربية</p>
        <p>مناطق الخدمة : المملكة العربية السعودية ، جدة</p>
        </div>
      );
    },
  },

  {
    description: "مستشارة مبيعات عقارية , راسيات الماسية العقارية ",
    title: "ابتسام",
    src: "/asset/card-4.avif",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
  <div>
        <p>
          ريم، مستشارة عقارية متميزة بخبرة واسعة في مجال الخدمات العقارية والمبيعات. أمتلك رؤية استراتيجية وقدرة على تقديم استشارات مخصصة لتحقيق أفضل النتائج لعملائنا. أتميز بالاهتمام بأدق التفاصيل لضمان تجربة سلسة وناجحة في كل معاملة عقارية.
        </p>

        <p>اللغة: العربية</p>
        <p>مناطق الخدمة : المملكة العربية السعودية ، جدة</p>
        </div>
      );
    },
  },
  {
    description: "مستشار مبيعات عقارية , راسيات الماسية العقارية ",
    title: "أسامة",
    src: "/asset/card-3.avif",
    ctaText: "Visit",
    ctaLink: "https://ui.aceternity.com/templates",
    content: () => {
      return (
   <div>
        <p>
          ريم، مستشارة عقارية متميزة بخبرة واسعة في مجال الخدمات العقارية والمبيعات. أمتلك رؤية استراتيجية وقدرة على تقديم استشارات مخصصة لتحقيق أفضل النتائج لعملائنا. أتميز بالاهتمام بأدق التفاصيل لضمان تجربة سلسة وناجحة في كل معاملة عقارية.
        </p>

        <p>اللغة: العربية</p>
        <p>مناطق الخدمة : المملكة العربية السعودية ، جدة</p>
        </div>
      );
    },
  },
];