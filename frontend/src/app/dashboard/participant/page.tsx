"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

interface EventType {
  _id: string;
  title: string;
  banner: string;
  venue: string;
  date: string;
  fee: number;
  category: "open" | "junior" | "senior";
  type: "individual" | "team";
}

interface Registration {
  _id: string;
  paymentStatus: "PAID" | "PENDING";
  event: EventType;
}

interface BackendUser {
  _id: string;
  role: "participant" | "organizer" | "admin";
}

/* ---------------- COMPONENT ---------------- */

export default function UserDashboard() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [data, setData] = useState<{ upcoming: Registration[]; past: Registration[] }>({
    upcoming: [],
    past: [],
  });

  // 🔎 Filters
  const [search, setSearch] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  /* ---------------- FETCH USER ROLE ---------------- */
  useEffect(() => {
    const init = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u: BackendUser = await res.json();
        setBackendUser(u);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setCheckingAccess(false);
      }
    };

    init();
  }, [getToken]);

  /* ---------------- FETCH REGISTRATIONS (ONLY PARTICIPANTS) ---------------- */
  useEffect(() => {
    if (!backendUser || backendUser.role !== "participant") return;

    const loadEvents = async () => {
      try {
        const token = await getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/registrations/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        const allRegs: Registration[] = Array.isArray(result)
          ? result
          : [...(result.upcoming || []), ...(result.past || [])];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming: Registration[] = [];
        const past: Registration[] = [];

        allRegs.forEach((r) => {
          const eventDate = new Date(r.event.date);
          eventDate.setHours(0, 0, 0, 0);

          if (eventDate >= today) upcoming.push(r);
          else past.push(r);
        });

        upcoming.sort(
          (a: Registration, b: Registration) =>
            new Date(a.event.date).getTime() - new Date(b.event.date).getTime()
        );

        past.sort(
          (a: Registration, b: Registration) =>
            new Date(b.event.date).getTime() - new Date(a.event.date).getTime()
        );

        setData({ upcoming, past });
      } catch (err) {
        console.error("Failed to load registrations", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, [backendUser, getToken]);

  /* ---------------- FILTER LOGIC ---------------- */
  const applyFilters = (events: Registration[]) =>
    events.filter((r) => {
      const matchesSearch = r.event.title.toLowerCase().includes(search.toLowerCase());

      const matchesPaid =
        paidFilter === ""
          ? true
          : paidFilter === "free"
          ? r.event.fee === 0
          : r.event.fee > 0;

      const matchesCategory =
        categoryFilter === "" || r.event.category === categoryFilter;

      const matchesType =
        typeFilter === "" || r.event.type === typeFilter;

      return matchesSearch && matchesPaid && matchesCategory && matchesType;
    });

  const filteredUpcoming = useMemo(
    () => applyFilters(data.upcoming),
    [data.upcoming, search, paidFilter, categoryFilter, typeFilter]
  );

  const filteredPast = useMemo(
    () => applyFilters(data.past),
    [data.past, search, paidFilter, categoryFilter, typeFilter]
  );

  const clearFilters = () => {
    setSearch("");
    setPaidFilter("");
    setCategoryFilter("");
    setTypeFilter("");
  };

  /* ---------------- ACCESS CONTROL UI ---------------- */
  if (checkingAccess) return <p className="p-10">Checking access...</p>;

  if (!backendUser || backendUser.role !== "participant") {
    return (
      <div className="p-10 text-center mt-52 mb-52">
        <h1 className="text-2xl font-semibold text-red-600">
          You can't access this page
        </h1>
        <p className="text-gray-600 mt-2">
          This dashboard is only available for participants.
        </p>
      </div>
    );
  }

  if (loadingEvents) return <p className="p-10">Loading your events...</p>;

  /* ---------------- CARD ---------------- */
  const renderCard = (r: Registration) => (
    <div
      key={r._id}
      onClick={() => router.push(`/events/${r.event._id}`)}
      className="cursor-pointer bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
    >
      <img src={r.event.banner} className="h-44 w-full object-cover" />

      <div className="p-4">
        <h3 className="text-lg font-semibold">{r.event.title}</h3>
        <p className="text-sm text-gray-500">{r.event.venue}</p>

        <div className="flex justify-between mt-2 text-sm">
          <span>📅 {new Date(r.event.date).toDateString()}</span>
          <span
            className={`px-2 py-1 text-xs rounded text-white ${
              r.paymentStatus === "PAID" ? "bg-green-600" : "bg-blue-500"
            }`}
          >
            {r.paymentStatus}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Category: {r.event.category}</span>
          <span>{r.event.fee === 0 ? "Free Event" : `₹${r.event.fee}`}</span>
        </div>
      </div>
    </div>
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-8">🎫 My Registered Events</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-10 grid md:grid-cols-5 gap-4">
        <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded" />

        <select value={paidFilter} onChange={(e) => setPaidFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="free">Free</option>
        </select>

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Categories</option>
          <option value="open">Open</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Types</option>
          <option value="individual">Individual</option>
          <option value="team">Team</option>
        </select>

        <button onClick={clearFilters} className="bg-gray-200 hover:bg-gray-300 rounded p-2">
          Remove Filters
        </button>
      </div>

      {/* Upcoming */}
      <section className="mb-12">
        <h2 className="text-xl font-medium mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredUpcoming.map(renderCard)}
        </div>
      </section>

      {/* Past */}
      <section>
        <h2 className="text-xl font-medium mb-4">Past Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPast.map(renderCard)}
        </div>
      </section>
    </div>
  );
}
