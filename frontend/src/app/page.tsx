import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-800 font-sans">
      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center mb-10 ">
        <div>
          <h2 className="text-5xl font-extrabold leading-tight">
            The Future of <span className="text-blue-600">Blockchain</span>{" "}
            <span className="text-cyan-500">Enabled</span>{" "}
            <span className="text-blue-500">Sports</span>{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Ecosystem
            </span>
          </h2>

          <p className="mt-6 text-lg text-zinc-600">
            Discover verified sports events, check in with secure QR codes,
            issue NFT certificates, verify achievements on blockchain and build
            your on-chain sports identity.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium"
            >
              Explore Events
            </Link>

            <Link
              href="/dashboard/organizer"
              className="px-6 py-3 rounded-lg border border-zinc-300 hover:bg-zinc-100"
            >
              Host an Event
            </Link>

            <Link href="/verify">
              <button className="px-6 py-3 rounded-lg border border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm hover:shadow-md transition">
                Verify a Certificate
              </button>
            </Link>
          </div>
        </div>

        <div className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white z-0" />
          <Image
            src="/sports-hero.png"
            alt="Sports Event"
            fill
            className="object-contain z-10"
            priority
          />
        </div>
      </section>

      {/* ================= ROLE DASHBOARDS ================= */}
      <section className="bg-zinc-50 py-20 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 text-center mb-14">
          <h3 className="text-3xl font-bold">Platform Dashboards</h3>
          <p className="text-zinc-600 mt-2">
            Designed for Participants, Organizers, and Administrators
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <DashboardCard
              title="Participant Dashboard"
              desc="Track registrations, QR attendance history, NFT certificates, rankings, and receive automatic email updates."
              link="/dashboard/participant"
              color="blue"
            />
            <DashboardCard
              title="Organizer Dashboard"
              desc="Create events, manage teams, auto-select winners, mint NFT certificates, and send automated emails."
              link="/dashboard/organizer"
              color="green"
            />
            <DashboardCard
              title="Admin Control Panel"
              desc="Approve events, verify organizers, monitor blockchain records, and resolve disputes."
              link="/dashboard/admin"
              color="red"
            />
          </div>
        </div>
      </section>

      {/* ================= ADVANCED FEATURES ================= */}
      <section className="py-14  bg-gradient-to-br from-white/60 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h3 className="text-4xl font-bold mb-16">
            Advanced Web3 Sports Features
          </h3>

          <div className="grid md:grid-cols-3 gap-10 mb-8">
            <Feature
              title="QR Code Check-In"
              desc="Secure attendance tracking using unique QR codes at event venues."
            />

            <Feature
              title="Manual Winner Selection"
              desc="Organizers select winners after event completion before issuing certificates."
            />

            <Feature
              title="NFT Certificate Minting"
              desc="Winners and participants receive blockchain-based NFT certificates."
            />

            <Feature
              title="Certificate Verification Page"
              desc="Public verification portal to confirm authenticity of issued certificates."
            />

            <Feature
              title="Automated Email Notifications"
              desc="Participants receive confirmations, updates and certificate emails instantly."
            />

            <Feature
              title="On-Chain Record Storage"
              desc="Event data and certificate metadata securely stored on blockchain."
            />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center mb-18">
          <h3 className="text-3xl font-bold">How SportChain Works</h3>

          <div className="grid md:grid-cols-4 gap-8 mt-8 mb-12">
            <Step number="1" text="Create your sports profile" />
            <Step number="2" text="Join or host approved events" />
            <Step number="3" text="Check in using secure QR code" />
            <Step
              number="4"
              text="Winners selected & NFT certificates issued"
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 text-center bg-zinc-50  border-y border-zinc-200">
        <h3 className="text-3xl font-bold">
          Start Your Verified Blockchain Sports Journey
        </h3>
        <p className="mt-3 text-zinc-600">
          Join a transparent, automated, and trusted sports ecosystem powered by
          Web3 technology.
        </p>

        <div className="mt-6 flex justify-center gap-4 mb-6 flex-wrap mb-20 ">
          <Link href="/dashboard/organizer">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Host an Event
            </button>
          </Link>

          <Link
            href="/events"
            className="px-6 py-3 border border-zinc-300 rounded-lg hover:bg-zinc-100"
          >
            Explore Events
          </Link>

          <Link href="/verify">
            <button className="px-6 py-3 rounded-lg border border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm hover:shadow-md transition">
              Verify a Certificate
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function DashboardCard({ title, desc, link, color }: any) {
  const colors: any = {
    blue: "hover:border-blue-500",
    green: "hover:border-green-500",
    red: "hover:border-red-500",
  };

  return (
    <div
      className={`bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm ${colors[color]} transition`}
    >
      <h4 className="text-xl font-semibold">{title}</h4>
      <p className="text-zinc-600 mt-3 text-sm">{desc}</p>
      <Link
        href={link}
        className="inline-block mt-6 text-blue-600 font-medium hover:underline"
      >
        Open Dashboard →
      </Link>
    </div>
  );
}

function Feature({ title, desc }: any) {
  return (
    <div className="bg-white/40 backdrop-blur-2xl border border-white/40 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
      <h4 className="text-lg font-semibold mb-3">{title}</h4>
      <p className="text-zinc-700 text-sm">{desc}</p>
    </div>
  );
}

function Step({ number, text }: any) {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-md hover:shadow-xl transition">
      <div className="text-blue-600 font-bold text-lg mb-2">Step {number}</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}
