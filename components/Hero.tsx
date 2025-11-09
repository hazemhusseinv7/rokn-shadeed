import Search from "@/components/Search";
import BotDetection from "@/components/forgeui/bot-detection";
import LightRays from "./LightRays";

const Hero = () => {
  return (
    <section id="hero">
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
        <Search className="relative top-10 z-10" />
      </div>
    </section>
  );
};

export default Hero;
