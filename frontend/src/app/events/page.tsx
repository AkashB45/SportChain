"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔎 Filters
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");

  /* ---------------- FETCH EVENTS ---------------- */
  const loadEvents = async () => {
    const token = await getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const valid = data.filter((e: any) => {
      const eventDate = new Date(e.date);
      const eventDay = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
      );

      return e.registrationsClosed === false && eventDay >= today;
    });

    setEvents(valid);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  /* ---------------- FILTER + SORT LOGIC ---------------- */
  const filteredEvents = useMemo(() => {
    let list = [...events];

    // Search
    if (search) {
      list = list.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category
    if (categoryFilter) {
      list = list.filter((e) => e.category === categoryFilter);
    }

    // Type
    if (typeFilter) {
      list = list.filter((e) => e.type === typeFilter);
    }

    // Paid/Free
    if (paidFilter === "free") list = list.filter((e) => e.fee === 0);
    if (paidFilter === "paid") list = list.filter((e) => e.fee > 0);

    // Sorting
    if (sort === "latest")
      list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    if (sort === "fee") list.sort((a, b) => a.fee - b.fee);

    if (sort === "capacity") list.sort((a, b) => b.capacity - a.capacity);

    if (sort === "date")
      list.sort((a, b) => +new Date(a.date) - +new Date(b.date));

    return list;
  }, [events, search, sort, categoryFilter, typeFilter, paidFilter]);

  const clearFilters = () => {
    setSearch("");
    setSort("latest");
    setCategoryFilter("");
    setTypeFilter("");
    setPaidFilter("");
  };

  if (loading) return <p className="p-8">Loading events...</p>;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">🏟 Discover Sports Events</h1>

      {/* FILTER BAR */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 grid md:grid-cols-6 gap-4">
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="open">Open</option>
          <option value="junior">Junior</option>
          <option value="senior">Senior</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Types</option>
          <option value="individual">Individual</option>
          <option value="team">Team</option>
        </select>

        <select
          value={paidFilter}
          onChange={(e) => setPaidFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="">All Prices</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="latest">Latest Added</option>
          <option value="date">Event Date</option>
          <option value="fee">Lowest Fee</option>
          <option value="capacity">Highest Capacity</option>
        </select>

        <button
          onClick={clearFilters}
          className="bg-gray-200 hover:bg-gray-300 rounded-lg p-2 font-medium"
        >
          Remove Filters
        </button>
      </div>

      {/* EVENTS GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {filteredEvents.map((e) => (
          <div
            key={e._id}
            onClick={() => router.push(`/events/${e._id}`)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
          >
            <img src={e.banner} className="h-44 w-full object-cover" />

            <div className="p-5">
              <h3 className="text-lg font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-500">{e.venue}</p>

              <div className="flex justify-between mt-3 text-sm">
                <span>
                  👥 {e.participantCount}/{e.capacity}
                </span>
                <span className="font-semibold">
                  {e.fee === 0 ? "Free" : `₹${e.fee}`}
                </span>
              </div>

              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>📅 {new Date(e.date).toLocaleDateString()}</span>
                <span className="capitalize">{e.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          No matching events found.
        </p>
      )}
    </div>
  );
}
