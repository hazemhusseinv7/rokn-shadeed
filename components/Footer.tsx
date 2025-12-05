import Link from "next/link";
import Image from "next/image";

import { getLocale } from "next-intl/server";

import Earth from "@/components/ui/globe";
import { Sparkles } from "@/components/ui/sparkles";
import { getFooterData, getSettingsData } from "@/lib/sanity/queries";
import {
  FaXTwitter,
  FaInstagram,
  FaTiktok,
  FaSnapchat,
  FaLinkedin,
  FaFacebook,
  FaYoutube,
  FaTelegram,
} from "react-icons/fa6";
import { RiWhatsappLine } from "react-icons/ri";

const Footer = async () => {
  const locale = await getLocale();
  const footer: FooterType | null = await getFooterData(locale);
  const settings: SettingsType | null = await getSettingsData();

  const socialMedia = [
    {
      name: "LinkedIn",
      link: settings?.linkedin,
      icon: FaLinkedin,
    },
    {
      name: "Twitter",
      link: settings?.twitter,
      icon: FaXTwitter,
    },
    {
      name: "TikTok",
      link: settings?.tiktok,
      icon: FaTiktok,
    },
    {
      name: "Telegram",
      link: settings?.telegram,
      icon: FaTelegram,
    },
    {
      name: "Instagram",
      link: settings?.instagram,
      icon: FaInstagram,
    },
    {
      name: "Snapchat",
      link: settings?.snapchat,
      icon: FaSnapchat,
    },
    {
      name: "WhatsApp",
      link: settings?.whatsapp,
      icon: RiWhatsappLine,
    },
    {
      name: "Facebook",
      link: settings?.facebook,
      icon: FaFacebook,
    },
    {
      name: "YouTube",
      link: settings?.youtube,
      icon: FaYoutube,
    },
  ].filter((item) => item.link);

  return (
    <footer>
      <div className="min-h-240 overflow-hidden px-4">
        <div className="relative z-10 grid gap-4 pt-10 text-center">
          <Link
            href={footer?.globeButtonLink || "#"}
            className="hover:bg-background bg-primary-3/40 shadow-primary-2 dark:shadow-primary-3 mx-auto inline-block w-fit rounded-full border border-[#3273ff] p-1 px-3 text-sm shadow-2xl transition-colors duration-300 dark:bg-[#0f1c35]"
          >
            {footer?.globeButton}
          </Link>

          <p className="from-primary-3 to-primary-2 dark:from-primary-1 dark:to-primary-1/70 bg-linear-to-b bg-clip-text text-xl leading-normal font-semibold tracking-tighter text-transparent md:text-4xl">
            {footer?.globeTitleLine1}
            <br />
            {footer?.globeTitleLine2}
          </p>

          <p className="from-primary-2 to-primary-2 dark:from-primary-1 dark:to-primary-1/80 bg-linear-to-b bg-clip-text text-sm leading-normal font-light tracking-tighter text-transparent lg:text-lg">
            {footer?.globeDescriptionLine1}
            <br />
            {footer?.globeDescriptionLine2}
          </p>

          <Earth />
        </div>
        <div className="relative -mt-32 h-80 w-screen overflow-hidden mask-[radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#3273ff,transparent_90%)] before:opacity-40">
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
      <div className="relative mx-auto -mt-70 mb-8 h-fit w-[95%] overflow-hidden rounded-lg border [--gradient-center:#f3f4f6] [--gradient-edge:#f3f4f6] md:-mt-60 dark:[--gradient-center:#02081765] dark:[--gradient-edge:#020817]">
        <div className="dark:from-primary-2 dark:to-primary-3 from-primary-2 via-primary-3 to-primary-3 justify-between gap-10 rounded-xs rounded-b-none bg-linear-to-tr p-5 py-5 text-white sm:flex 2xl:py-10">
          <div className="flex w-fit flex-col justify-center">
            <div className="w-64 space-y-1 py-2 2xl:w-80">
              <Link href="/">
                <Image
                  src="/logo/logo-alt-3.svg"
                  alt="logo"
                  width={32}
                  height={32}
                  className="mb-10 size-20"
                />
              </Link>
              <p className="text-sm leading-[120%]">
                {footer?.cardDescription}
              </p>
            </div>
          </div>

          <div className="relative z-1 mt-4 grid w-full grid-cols-3 items-center gap-2 sm:mt-0 sm:w-auto">
            {socialMedia.map(({ name, link, icon: Icon }, i) => (
              <Link
                key={i}
                href={link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="grid h-32 w-full place-content-center rounded-lg bg-zinc-50 p-5 transition-colors duration-500 hover:bg-zinc-300 sm:w-auto 2xl:h-40 2xl:p-10"
              >
                <Icon className="text-primary-2 size-14 sm:size-24" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
