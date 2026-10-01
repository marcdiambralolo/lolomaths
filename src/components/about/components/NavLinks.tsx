"use client";
import NavLink from "./NavLink";

interface NavProps {
    items: Array<{ id: string; label: string }>;
}

function NavLinks({ items }: NavProps) {
    return (
        <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold">
            {items.map((item) => (
                <NavLink key={item.id} href={`#${item.id}`} label={item.label} />
            ))}
        </div>
    );
}

export default NavLinks;