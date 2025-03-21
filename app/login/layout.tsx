// app/login/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Вход в аккаунт | Student Saver",
  description: "Авторизуйтесь, чтобы использовать все возможности сайта",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>{children}</main>
  );
}
