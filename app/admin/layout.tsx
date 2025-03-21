import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Админ-панель | Student Saver",
  description: "Админ панель для управления контентом",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
      <main>{children}</main>
    );
  }