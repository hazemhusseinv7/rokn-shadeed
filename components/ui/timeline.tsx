"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScroll, useTransform, motion } from "motion/react";
import { urlFor } from "@/lib/sanity/image";

export const Timeline = ({ data }: { data: BlogPost[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white py-32 md:px-10 dark:bg-neutral-950"
      ref={containerRef}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:px-10">
        <h1 className="mb-4 max-w-4xl text-lg text-black md:text-4xl dark:text-white"></h1>
        <p className="max-w-sm text-sm text-neutral-700 md:text-base dark:text-neutral-300"></p>
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map(({ title, mainImage, slug }, index) => (
          <Link
            href={`/blog/${slug.current}`}
            key={index}
            className="flex justify-start pt-10 md:gap-10 md:pt-40"
          >
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-full">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white md:left-3 rtl:right-3 rtl:md:right-3 dark:bg-black">
                <div className="size-4 rounded-full border border-neutral-300 bg-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800" />
              </div>
              <div className="hidden text-xl font-bold text-neutral-500 md:block md:text-5xl ltr:md:pl-20 rtl:md:pr-20 dark:text-neutral-500">
                <p className="mb-8 text-xl font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                  {title}
                </p>
              </div>
            </div>

            <div className="relative w-full pr-4 ltr:pl-20 ltr:md:pl-4 rtl:pr-20 rtl:md:pr-4">
              <div className="mb-4 block text-left text-2xl font-bold text-neutral-500 md:hidden dark:text-neutral-500">
                <p className="mb-8 text-xl font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                  {title}
                </p>
              </div>
              <div className="aspect-video">
                <Image
                  src={urlFor(mainImage).width(500).height(500).url()}
                  alt={title}
                  width={500}
                  height={500}
                  className="size-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]"
                />
              </div>
            </div>
          </Link>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute top-0 left-8 w-0.5 overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 to-transparent to-99% mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8 rtl:right-8 rtl:md:right-8 dark:via-neutral-700"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="from-primary-1/80 via-primary-3 absolute inset-x-0 top-0 w-0.5 rounded-full bg-linear-to-t from-0% via-10% to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
