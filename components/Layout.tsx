import MenuBar from '@/components/MenuBar';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <MenuBar />
      <main className="pt-10">
        {children}
      </main>
      <Footer />
    </>
  )
}
