export const instant = false;

import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import FabricExpertise from "@/components/FabricExpertise";
import Community from "@/components/Community";
import Reassurance from "@/components/Reassurance";
import { getProducts } from "@/lib/db";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts products={products} />
      <FabricExpertise />
      <Community />
      <Reassurance />
    </>
  );
}
