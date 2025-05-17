import { Inter } from 'next/font/google';
import './onboarding-styles.css';

const inter = Inter({ subsets: ['latin'] });

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-900 text-white`}>
      {children}
    </div>
  );
}
