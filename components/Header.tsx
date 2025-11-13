import { Navbar, NavBody, NavbarLogo } from "@/components/ui/resizable-navbar";
import { LimelightNav } from "@/components/ui/shadcn-io/limelight-nav";

import { PiMagnifyingGlassBold } from "react-icons/pi";
import { MdOutlineMarkChatRead } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";
const Header = () => {
  const items = [
    {
      id: "search",
      icon: <PiMagnifyingGlassBold />,
      label: "Search",
      link: "/",
    },
    {
      id: "contact-us",
      icon: <MdOutlineMarkChatRead />,
      label: "Contact us",
      link: "/contact",
    },
    {
      id: "blog",
      icon: <CgFileDocument />,
      label: "Blog",
      link: "/blog",
    },
  ];

  return (
    <>
      <header className="relative w-full">
        <Navbar>
          <NavBody>
            <NavbarLogo />

            <LimelightNav items={items} />
          </NavBody>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
