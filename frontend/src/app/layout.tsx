import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Script from "next/script";
import AfterLoginSync from "./(auth)/after-login";
import DashboardNavLink from "./DashboardNavLink";
export const metadata: Metadata = {
  title: "SportsChain",
  description: "Secure Sports Event Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignInUrl="/"
      afterSignUpUrl="/"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorBackground: "#ffffff",
          colorText: "#111827",
          colorPrimary: "#2563eb",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html lang="en">
        <body className="bg-white text-gray-900">
          {/* HEADER */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
              {/* LOGO */}
              <h1 className="text-2xl font-extrabold text-blue-600">
                <Link href="/">SportsChain</Link>
              </h1>

              {/* NAV */}
              {/* NAV */}
<nav className="hidden md:flex items-center gap-8 text-sm font-medium">

  <NavItem href="/" label="Home" />

  <SignedIn>
    <DashboardNavLink />
  </SignedIn>

  <NavItem href="/events" label="Events" />
  <NavItem href="/features" label="Features" />
  <NavItem href="/contact" label="Contact" />

</nav>

              {/* AUTH BUTTONS */}
              <div className="flex items-center gap-3">
                <SignedOut>
                  {/* SIGN IN */}
                  <SignInButton mode="modal" >
                    <button className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition">
                      Sign In
                    </button>
                  </SignInButton>

                  {/* SIGN UP */}
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>

                {/* User Profile (far right) */}
                <SignedIn >
                  <div className="ml-2">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main>{children}</main>
          {/* ================= FOOTER ================= */}
          <footer className="relative mt-0">

            <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

            <div className="bg-white/70 backdrop-blur-2xl border-t border-white/40 py-14">
              <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-sm">

                <div>
                  <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SportsChain
                  </h4>
                  <p className="mt-4 text-zinc-600">
                    Blockchain-powered sports event ecosystem with NFT certification.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2 text-zinc-600">
                    <li><Link href="/events">Events</Link></li>
                    <li><Link href="/verify">Verify Certificate</Link></li>
                    <li><Link href="/dashboard/participant">Participant</Link></li>
                    <li><Link href="/dashboard/organizer">Organizer</Link></li>
                    <li><Link href="/dashboard/admin">Admin</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Resources</h4>
                  <ul className="space-y-2 text-zinc-600">
                    <li><Link href="/features">Features</Link></li>
                    <li><Link href="/help">Help Center</Link></li>
                    <li><Link href="/privacy">Privacy Policy</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-zinc-600">
                    <li><Link href="/terms">Terms</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                  </ul>
                </div>

              </div>

              <div className="mt-10 border-t border-white/40 pt-6 text-center text-xs text-zinc-500">
                © {new Date().getFullYear()} SportsChain. All rights reserved.
              </div>
            </div>
          </footer>

          {/* SCRIPTS */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />

          <AfterLoginSync />
        </body>
      </html>
    </ClerkProvider>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative group transition text-gray-800 "
    >
      {label}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}