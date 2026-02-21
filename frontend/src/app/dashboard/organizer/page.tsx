"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar
} from "recharts";
type DBUser = { role: string };
type Organizer = { blockchainHash?: string };

export default function OrganizerDashboard() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<DBUser | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [revenues, setRevenues] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authFetch = async (url: string, options: any = {}) => {
    const token = await getToken();
    return fetch(url, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options.headers },
    });
  };

  useEffect(() => {
    const init = async () => {
      try {
        const u = await (await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`)).json();
        setUser(u);

        if (u.role === "organizer") {
          const org = await (await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/me`)).json();
          setOrganizer(org);

          const ev = await (await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/events`)).json();
          setEvents(ev);

          const revMap: Record<string, number> = {};
          await Promise.all(
            ev.map(async (e: any) => {
              const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/events/${e._id}/revenue`);
              const data = await res.json();
              revMap[e._id] = data.revenue || 0;
            })
          );
          setRevenues(revMap);
        }
      } catch {
        setError("Only verified organizers can access this dashboard");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const toggleRegistration = async (ev: any, id: string) => {
    ev.stopPropagation();
    await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${id}/toggle-registration`, { method: "PATCH" });
    location.reload();
  };

  const deleteEvent = async (ev: any, id: string) => {
    ev.stopPropagation();
    if (!confirm("Cancel this event permanently?")) return;
    await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${id}`, { method: "DELETE" });
    location.reload();
  };

  if (loading) return <p className="p-10 text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-red-600 p-10">{error}</p>;

  if (user?.role !== "organizer") {
    return (
      <AccessDenied
        title="You are not an organizer"
        desc="Apply for organizer access to start creating and managing events."
        btn="Request Organizer Access"
        path="/dashboard/request-organizer"
      />
    );
  }

  if (!organizer?.blockchainHash) {
    return (
      <AccessDenied
        title="Blockchain verification required"
        desc="Verify your organizer identity on blockchain to unlock dashboard access."
        btn="Verify Organizer"
        path="/organizer/wallet"
      />
    );
  }

  /* 📊 SMART STATS */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(e => new Date(e.date) >= today);
  const pastEvents = events.filter(e => new Date(e.date) < today);

  const totalRevenue = Object.values(revenues).reduce((a, b) => a + b, 0);
  const freeEvents = events.filter(e => e.fee === 0).length;
  const paidEvents = events.filter(e => e.fee > 0).length;

  const totalParticipants = events.reduce((sum, e) => sum + (e.participantCount || 0), 0);
  const avgParticipants = events.length ? Math.round(totalParticipants / events.length) : 0;

  const topRevenueEvent = events.reduce((top, e) => {
    const rev = revenues[e._id] || 0;
    return rev > (revenues[top?._id] || 0) ? e : top;
  }, events[0]);

    const revenueChartData = events
    .map(e => ({
      name: new Date(e.date).toLocaleDateString(),
      revenue: revenues[e._id] || 0,
    }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  const registrationChartData = events
    .map(e => ({
      name: new Date(e.date).toLocaleDateString(),
      participants: e.participantCount || 0,
    }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">Organizer Control Center</h1>
          <p className="text-gray-600 text-sm">Performance insights & event management</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/organizer/create-event")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl shadow-lg transition"
        >
          ➕ Create Event
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Events" value={events.length} />
        <StatCard title="Upcoming Events" value={upcomingEvents.length} />
        <StatCard title="Past Events" value={pastEvents.length} />
        <StatCard title="Free Events" value={freeEvents} />
        <StatCard title="Paid Events" value={paidEvents} />
        <StatCard title="Total Participants" value={totalParticipants} />
        <StatCard title="Avg Participants/Event" value={avgParticipants} />
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} highlight />
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Registrations Over Time">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={registrationChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="participants" fill="#16a34a" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>


      {/* TOP PERFORMER */}
      {topRevenueEvent && (
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-6 shadow-lg mb-12">
          <h2 className="text-lg font-semibold mb-1">🏆 Highest Revenue Event</h2>
          <p className="text-2xl font-bold">{topRevenueEvent.title}</p>
          <p className="text-sm opacity-90">Revenue: ₹{revenues[topRevenueEvent._id] || 0}</p>
        </div>
      )}

      {/* UPCOMING EVENTS */}
      <Section title="🚀 Upcoming Events">
        <EventGrid events={upcomingEvents} revenues={revenues} router={router} toggleRegistration={toggleRegistration} deleteEvent={deleteEvent} />
      </Section>

      {/* PAST EVENTS */}
      <Section title="📦 Past Events">
        <EventGrid events={pastEvents} revenues={revenues} router={router} toggleRegistration={toggleRegistration} deleteEvent={deleteEvent} past />
      </Section>
    </div>
  );
}

/* ---------- NEW UI COMPONENTS (ADDED ONLY) ---------- */

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}


function AccessDenied({ title, desc, btn, path }: any) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-10 text-center w-[420px]">
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-gray-600 text-sm mb-6">{desc}</p>
        <button onClick={() => router.push(path)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition shadow">
          {btn}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-14">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function EventGrid({ events, revenues, router, toggleRegistration, deleteEvent, past }: any) {
  if (events.length === 0) return <p className="text-gray-400">No events here yet.</p>;

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
      {events.map((e: any) => {
        const isLow = e.participantCount < e.capacity * 0.3;
        return (
          <div key={e._id} onClick={() => router.push(`/events/${e._id}`)}
            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">

            <img src={e.banner} className="w-full h-40 object-cover" />

            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{e.title}</h3>
                {isLow && !past && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">⚠ Low Registration</span>
                )}
              </div>

              <p className="text-sm text-gray-500 mt-1">{e.venue}</p>

              <div className="grid grid-cols-2 text-xs text-gray-500 mt-4 gap-y-1">
                <p>📅 {new Date(e.date).toLocaleDateString()}</p>
                <p>👥 {e.participantCount}/{e.capacity}</p>
                <p>🏆 {e.prizeDetails?.first || "TBA"}</p>
                <p className="font-semibold text-green-600">💰 ₹{revenues[e._id] || 0}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {!past && (
                  <button onClick={(ev) => toggleRegistration(ev, e._id)} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    {e.registrationsClosed ? "Open" : "Freeze"}
                  </button>
                )}
                <button onClick={(ev) => { ev.stopPropagation(); router.push(`/dashboard/organizer/events/${e._id}/participants`); }}
                  className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                  Participants
                </button>
                {!past && (
                  <button onClick={(ev) => deleteEvent(ev, e._id)} className="text-xs bg-black text-white px-2 py-1 rounded">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* 📈 Revenue Trend */
function RevenueTrendChart({ events, revenues }: any) {
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h3 className="font-semibold mb-4 text-indigo-700">📈 Revenue Trend</h3>
      <div className="flex items-end gap-2 h-40">
        {sorted.map((e, i) => (
          <div key={i} className="flex-1 bg-indigo-200 rounded-t-lg"
            style={{ height: `${(revenues[e._id] || 0) / 10 + 10}px` }}
            title={`${e.title} ₹${revenues[e._id] || 0}`} />
        ))}
      </div>
    </div>
  );
}

/* 👥 Registration Trend */
function RegistrationTrendChart({ events }: any) {
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h3 className="font-semibold mb-4 text-pink-600">👥 Registrations Over Time</h3>
      <div className="flex items-end gap-2 h-40">
        {sorted.map((e, i) => (
          <div key={i} className="flex-1 bg-pink-200 rounded-t-lg"
            style={{ height: `${(e.participantCount || 0) + 10}px` }}
            title={`${e.title} ${e.participantCount} participants`} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, highlight }: any) {
  return (
    <div className={`rounded-2xl p-5 shadow-md ${highlight ? "bg-blue-600 text-white" : "bg-white"}`}>
      <p className={`text-sm ${highlight ? "opacity-80" : "text-gray-500"}`}>{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
