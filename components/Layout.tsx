import MenuBar from '@/components/MenuBar';

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <MenuBar />
      <main>{children}</main>
    </>
  )
}


