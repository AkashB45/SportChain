import { auth } from "@clerk/nextjs/server";
import RegisterSection from "@/components/RegisterSection";
import ClientOnly from "@/components/ClientOnly";
import EventQRSection from "@/components/EventQRSection";

type PageProps = {
  params: { id: string };
};

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;

  const authData = await auth();

  if (!authData.userId) {
    throw new Error("Unauthorized");
  }

  const token = await authData.getToken();
  if (!token) throw new Error("Unauthorized");

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${API_URL}/api/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  
  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Unable to load event</h2>
      </div>
    );
  }
  
  const e = await res.json();
  // console.log(e);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO */}
      <div className="relative h-[420px]">
        <img
          src={e.banner}
          className="absolute inset-0 w-full h-full object-fill"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-10 left-10 text-white max-w-3xl">
          <h1 className="text-4xl font-bold">{e.title}</h1>
          <p className="mt-2 text-lg text-gray-200">
            {e.sport} • {e.category.toUpperCase()}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-8 py-10 grid md:grid-cols-3 gap-10">
        {/* LEFT PANEL */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">📖 About the Event</h2>
            <p className="text-gray-700 leading-relaxed">{e.description}</p>
          </section>

          <section className="grid grid-cols-2 gap-6">
            <Info label="📅 Date" value={new Date(e.date).toDateString()} />
            <Info label="📍 Venue" value={e.venue} />
            <Info
              label="👥 Capacity"
              value={`${e.participantCount}/${e.capacity}`}
            />
            <Info label="💰 Fee" value={e.fee === 0 ? "Free" : `₹${e.fee}`} />
            <Info
              label="🏷 Type"
              value={
                e.eventType === "team"
                  ? `Team (${e.teamSize} members)`
                  : "Individual"
              }
            />
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">🏆 Prizes</h3>
            <ul className="list-disc ml-6 text-gray-700">
              {e.prizeDetails?.first && <li>🥇 {e.prizeDetails.first}</li>}
              {e.prizeDetails?.second && <li>🥈 {e.prizeDetails.second}</li>}
              {e.prizeDetails?.third && <li>🥉 {e.prizeDetails.third}</li>}
            </ul>
          </section>

          {e.certificateEnabled && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
              🎓 Digital Certificates will be issued after the event.
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">📞 Contact Organizer</h3>
          <p className="text-gray-700">{e.contactName}</p>
          <p className="text-gray-500">{e.contactNumber}</p>

          <a
            href={e.locationUrl}
            target="_blank"
            className="inline-block mt-3 text-blue-600 "
          >
            📍 View Location
          </a>

          <div className="mt-6 border-t pt-6">
            <ClientOnly>
              <RegisterSection event={e} />
              <br />

              {/* 🔐 Pass auth userId */}
              <EventQRSection
                event={e}
                organizerId={e.organizer}
              />
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
