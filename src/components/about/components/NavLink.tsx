"use client";

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink = ({ href, label }: NavLinkProps) => (
  <a href={href} className="text-purple-500 hover:text-purple-800 transition capitalize">
    {label}
  </a>
); 

export default NavLink;  