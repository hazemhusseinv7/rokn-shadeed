import Link from "next/link";
import { getTranslations } from "next-intl/server";

import Earth from "@/components/ui/globe";
import { Sparkles } from "@/components/ui/sparkles";

const Footer = async () => {
  const t = await getTranslations("Footer");

  return (
    <footer>
      <div className="h-screen overflow-hidden px-4">
        <div className="relative z-10 grid gap-4 pt-10 text-center">
          <Link
            href="/contact"
            className="hover:bg-background bg-primary-3/40 shadow-primary-2 dark:shadow-primary-3 mx-auto inline-block w-fit rounded-full border border-[#3273ff] p-1 px-3 text-sm shadow-2xl transition-colors duration-300 dark:bg-[#0f1c35]"
          >
            {t("button")}
          </Link>

          <p className="from-primary-3 to-primary-2 dark:from-primary-1 dark:to-primary-1/70 bg-linear-to-b bg-clip-text text-xl leading-normal font-semibold tracking-tighter text-transparent md:text-4xl">
            {t("title.item-1")}
            <br />
            {t("title.item-2")}
          </p>

          <p className="from-primary-2 to-primary-2 dark:from-primary-1 dark:to-primary-1/80 bg-linear-to-b bg-clip-text text-sm leading-normal font-light tracking-tighter text-transparent lg:text-lg">
            {t("description.item-1")}
            <br />
            {t("description.item-2")}
          </p>

          <Earth />
        </div>
        <div className="relative -mt-32 h-80 w-screen overflow-hidden mask-[radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#3273ff,transparent_90%)] before:opacity-40 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[10%] after:border-t after:border-[#163474] after:bg-[#7b9cda] dark:after:bg-[#08132b]">
          <Sparkles
            density={800}
            speed={1.2}
            size={1.2}
            direction="top"
            opacitySpeed={2}
            color="#32A7FF"
            className="absolute inset-x-0 bottom-0 h-full w-full"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
