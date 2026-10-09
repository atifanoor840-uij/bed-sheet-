import { CartProvider } from "@/components/cart";
import { CatalogProvider } from "@/components/catalog";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { currentUser } from "@/lib/auth";
import { listProducts } from "@/lib/db";

// Products, stock and the signed-in user can change at any time, so render per request.
export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  return (
    <CatalogProvider products={listProducts()}>
      <CartProvider>
        <Header user={user ? { name: user.name, role: user.role } : null} />
        <main>{children}</main>
        <Footer />
      </CartProvider>
    </CatalogProvider>
  );
}
