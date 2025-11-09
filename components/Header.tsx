// "use client";

// import { useState } from "react";

import {
  Navbar,
  NavBody,
  // NavItems,
  // MobileNav,
  NavbarLogo,
  // NavbarButton,
  // MobileNavHeader,
  // MobileNavToggle,
  // MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { LimelightNav } from "@/components/ui/shadcn-io/limelight-nav";

const Header = () => {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const navItems = [];

  return (
    <>
      <div className="relative w-full">
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />
            <LimelightNav />
            {/* <NavItems items={navItems} /> */}
            {/* <div className="flex items-center gap-4">
              <NavbarButton variant="primary">Contact us</NavbarButton>
            </div> */}
          </NavBody>

          {/* Mobile Navigation */}
          {/* <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              <div className="flex w-full flex-col gap-4">
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                ></NavbarButton>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                ></NavbarButton>
              </div>
            </MobileNavMenu>
          </MobileNav> */}
        </Navbar>
        {/* Navbar */}
      </div>
      {/* <header className="absolute start-0 end-0 bottom-5 z-200 flex items-center justify-center">
        <LimelightNav />
      </header> */}
    </>
  );
};

export default Header;
