import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getCategories } from "@/lib/db";

export const instant = false;

export default async function BoutiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <>
      <SiteHeader categories={categories} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
