import BotDetection from "@/components/forgeui/bot-detection";
import LightRays from "@/components/LightRays";
import { TextEffect } from "@/components/motion-primitives/text-effect";

import { getHeroData } from "@/lib/sanity/queries";
import ActionSearchBar from "./kokonutui/action-search-bar";

const Hero = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;

  const data: HeroType | null = await getHeroData(locale);

  return (
    <section id="hero" className="overflow-hidden">
      <div className="relative min-h-screen pb-14">
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
            raysColor="#3f3f46"
            className="custom-rays"
          />
        </div>
        <BotDetection className="relative top-14 z-10 mx-auto rotate-180" />

        {data?.title && (
          <TextEffect
            per="word"
            as="h1"
            preset="blur"
            speedReveal={0.3}
            speedSegment={0.3}
            className="mt-14 text-center text-2xl md:mt-32"
          >
            {data.title}
          </TextEffect>
        )}

        <ActionSearchBar searchInputs={data?.searchInputs} />
      </div>
    </section>
  );
};

export default Hero;
