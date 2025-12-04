"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
interface EarthProps {
  className?: string;
  theta?: number;
  scale?: number;
  diffuse?: number;
  mapSamples?: number;
  mapBrightness?: number;
}

const Earth: React.FC<EarthProps> = ({
  className,
  theta = 0.25,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 40000,
  mapBrightness = 6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [initialTheme, setInitialTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");

      if (storedTheme) {
        if (storedTheme === "light" || storedTheme === "dark") {
          setInitialTheme(storedTheme);
        } else if (storedTheme === "system") {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          setInitialTheme(prefersDark ? "dark" : "light");
        }
      }
    }
  }, []);

  const currentTheme = useMemo(() => {
    if (!mounted) return initialTheme;

    if (resolvedTheme) {
      return resolvedTheme;
    }

    if (theme && theme !== "system") {
      return theme;
    }

    return initialTheme;
  }, [resolvedTheme, theme, initialTheme, mounted]);

  const getEarthColors = (theme: string) => {
    if (theme === "light") {
      return {
        dark: 0,
        baseColor: [1, 1, 1] as [number, number, number],
        glowColor: [1, 1, 1] as [number, number, number],
        markerColor: [0.8, 0.1, 0.1] as [number, number, number],
      };
    } else {
      return {
        dark: 1,
        baseColor: [0.4, 0.6509, 1] as [number, number, number],
        glowColor: [0.2745, 0.5765, 0.898] as [number, number, number],
        markerColor: [1, 0.5, 0.5] as [number, number, number],
      };
    }
  };

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    let width = 0;
    const onResize = () =>
      canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener("resize", onResize);
    onResize();
    let phi = 0;

    const colors = getEarthColors(currentTheme);

    onResize();
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: theta,
      dark: colors.dark,
      scale: scale,
      diffuse: diffuse,
      mapSamples: mapSamples,
      mapBrightness: mapBrightness,
      baseColor: colors.baseColor,
      markerColor: colors.markerColor,
      glowColor: colors.glowColor,
      opacity: 1,
      offset: [0, 0],
      markers: [
        // longitude latitude
      ],
      onRender: (state: Record<string, any>) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.\
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      window.removeEventListener("resize", onResize);
      globe.destroy();
    };
  }, [currentTheme, diffuse, mapBrightness, mapSamples, mounted, scale, theta]);

  return (
    <div
      className={cn(
        "z-10 mx-auto flex w-full max-w-[350px] items-center justify-center",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          aspectRatio: "1",
        }}
      />
    </div>
  );
};

export default Earth;
