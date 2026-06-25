"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Projects",
    href: "/projects",
  },
  {
    name: "Tasks",
    href: "/tasks",
  },
  {
    name: "Board",
    href: "/board",
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r border-zinc-200 p-6">
      <nav className="flex flex-col gap-4">

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`
              px-6 py-3 rounded-full border border-zinc-800
              transition-all duration-300
              ${
                pathname === link.href
                  ? "bg-black text-white"
                  : "text-black hover:bg-black hover:text-white"
              }
            `}
          >
            {link.name}
          </Link>
        ))}

      </nav>
    </aside>
  );
}