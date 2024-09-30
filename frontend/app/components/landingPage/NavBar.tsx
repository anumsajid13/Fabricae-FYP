import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import Image from 'next/image';

export default function App() {
  return (
    <Navbar className="px-0 bg-black">
      <NavbarBrand>
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className="text-white" href="#">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page" style={{ color: '#CDFB7C' }}>
            Explore
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-white" href="#">
            Contact us
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">
            <Button 
              color="secondary" 
              className="bg-black text-white border border-white rounded-full" // Style for Login button
            >
              Login
            </Button>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button 
            as={Link} 
            color="primary" 
            className="bg-black text-white border border-white rounded-full" // Style for Sign Up button
            href="#" 
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
