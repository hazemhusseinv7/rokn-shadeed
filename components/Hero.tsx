import Search from "@/components/Search";
import BotDetection from "@/components/forgeui/bot-detection";
import LightRays from "@/components/LightRays";
import { TextEffect } from "@/components/motion-primitives/text-effect";

import { getHeroData } from "@/lib/sanity/queries";

const Hero = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;

  const data: HeroType | null = await getHeroData(locale);

  return (
    <section id="hero" className="overflow-hidden">
      <div className="relative min-h-screen">
        <div className="absolute size-full">
          <LightRays
            raysOrigin="top-center"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
        <BotDetection className="relative top-14 z-10 mx-auto rotate-180" />

        {data?.title && (
          <TextEffect
            per="word"
            as="h1"
            preset="blur"
            className="mt-14 text-center text-2xl md:mt-32"
          >
            {data.title}
          </TextEffect>
        )}

        <Search
          searchInputs={data?.searchInputs}
          className="relative top-10 z-10"
        />
      </div>
    </section>
  );
};

export default Hero;
