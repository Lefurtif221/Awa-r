export const instant = false;

import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col">
      <header className="w-full bg-surface border-b border-[#F0E2DE] shadow-hairline">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logo-awa-r.jpeg"
              alt={SITE.name}
              width={48}
              height={48}
              className="h-11 w-11 rounded-full object-cover bg-surface-container-lowest"
            />
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
              Administration
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors"
            >
              Voir la boutique
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
