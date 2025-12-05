import BotDetection from "@/components/forgeui/bot-detection";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import ActionSearchBar from "@/components/kokonutui/action-search-bar";
import Silk from "@/components/Silk";

import { getHeroData } from "@/lib/sanity/queries";

const Hero = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;

  const data: HeroType | null = await getHeroData(locale);

  return (
    <section id="hero" className="overflow-hidden">
      <div className="relative min-h-screen pb-14">
        <div className="absolute size-full">
          <Silk speed={5} scale={1} noiseIntensity={1.5} rotation={0} />
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
