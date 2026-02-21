"use client";

export default function FeaturesPage() {
  const features = [
    {
      title: "Secure Admin Control",
      desc: "Powerful admin dashboard to manage users, organizers, and platform activity with full control.",
      icon: "🛡️",
    },
    {
      title: "Organizer Verification",
      desc: "Approve or reject event organizers with document validation and identity proof checks.",
      icon: "🏟️",
    },
    {
      title: "Role-Based Access",
      desc: "Different dashboards and permissions for admins, organizers, and users.",
      icon: "🔐",
    },
    {
      title: "Document Management",
      desc: "Upload, preview, and manage organizer verification documents securely.",
      icon: "📄",
    },
    {
      title: "Real-Time Updates",
      desc: "Instant approval and rejection updates without page reload delays.",
      icon: "⚡",
    },
    {
      title: "Modern Dashboard UI",
      desc: "Clean, responsive, and intuitive interface built for productivity.",
      icon: "🎨",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-16">
      <div className="max-w-6xl mx-auto text-center">

        {/* HERO */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          Powerful Platform Features
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-14">
          Everything you need to manage organizers, events, and platform access — all in one smart dashboard.
        </p>

        {/* FEATURE GRID */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8 border border-gray-100 text-left"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Built for efficiency. Designed for control.
          </h2>
          <p className="text-gray-600">
            A complete solution for managing event organizers securely and professionally.
          </p>
        </div>

      </div>
    </div>
  );
}
