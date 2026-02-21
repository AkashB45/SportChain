"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";

export default function ParticipantsPage() {
  const { id: eventId } = useParams();
  const { getToken } = useAuth();

  const [list, setList] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<
    "all" | "participated" | "absent" | "winners"
  >("all");

  // 🔹 Load Event Details
  useEffect(() => {
    if (!eventId) return;
    const loadEvent = async () => {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvent(await res.json());
    };
    loadEvent();
  }, [eventId]);

  // 🔹 Load registrations
  useEffect(() => {
    if (!eventId) return;
    const load = async () => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/events/${eventId}/registrations`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setList(await res.json());
      setLoading(false);
    };
    load();
  }, [eventId]);

  // 🔹 Load winners
  const loadWinners = async () => {
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/events/${eventId}/winners`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setWinners(await res.json());
  };

  useEffect(() => {
    if (eventId) loadWinners();
  }, [eventId]);

  // 🔹 Remove All Winners
  const clearWinners = async () => {
    if (!confirm("Remove all winners?")) return;
    const token = await getToken();
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/events/${eventId}/winners`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    loadWinners();
  };

  // 🔹 Winner map
  const winnerMap: Record<string, string> = {};
  winners.forEach((w) => {
    winnerMap[w.registration._id] = w.position;
  });

  // 🔹 Prize Options
  const prizeOptions: { label: string; value: string }[] = [];
  if (event?.prizeDetails?.first)
    prizeOptions.push({ label: "🥇 First", value: "FIRST" });
  if (event?.prizeDetails?.second)
    prizeOptions.push({ label: "🥈 Second", value: "SECOND" });
  if (event?.prizeDetails?.third)
    prizeOptions.push({ label: "🥉 Third", value: "THIRD" });

  // 🔹 Processed & Sorted Data
  const processedList = useMemo(() => {
    return list
      .map((team) => {
        const isWinner = winnerMap[team._id];

        let members = team.members.filter((m: any) =>
          m.name.toLowerCase().includes(search),
        );

        if (filterType === "participated")
          members = members.filter((m: any) => m.attended);

        if (filterType === "absent")
          members = members.filter((m: any) => !m.attended);

        if (filterType === "winners" && !isWinner) return null;

        if (members.length === 0) return null;

        const sortedMembers = [...members].sort((a, b) =>
          sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name),
        );

        return { ...team, sortedMembers };
      })
      .filter(Boolean);
  }, [list, search, sortOrder, filterType, winnerMap]);

  if (loading || !event) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">👥 Event Participants</h1>

        <div className="flex gap-3">
          <button
            onClick={clearWinners}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 text-sm"
          >
            🗑 Remove All Winners
          </button>

          <button
            onClick={async () => {
              if (
                !confirm("Generate certificates for all attended participants?")
              )
                return;

              try {
                const token = await getToken(); // 🔥 IMPORTANT

                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/events/${eventId}/generate-certificates`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`, // 🔥 REQUIRED
                      "Content-Type": "application/json",
                    },
                  },
                );

                const data = await response.json();

                if (!response.ok) {
                  alert(data.error || data.message || "Unauthorized");
                  return;
                }

                alert(`Success! ${data.minted} certificates generated.`);
              } catch (err) {
                console.error(err);
                alert("Something went wrong.");
              }
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 text-sm"
          >
            🎓 Generate Certificates
          </button>

          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/events/${eventId}/export`}
            target="_blank"
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 text-sm"
          >
            ⬇ Export CSV
          </a>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          placeholder="Search participant..."
          className="border px-3 py-2 rounded w-72 text-sm"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />

        {/* <select
          className="border px-3 py-2 rounded text-sm"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
        >
          <option value="asc">Sort Name A → Z</option>
          <option value="desc">Sort Name Z → A</option>
        </select> */}

        <select
          className="border px-3 py-2 rounded text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="participated">Participated</option>
          <option value="absent">Absent</option>
          <option value="winners">Winners Only</option>
        </select>
      </div>

      {processedList.map((team: any, i: number) => {
        const hasAttended = team.members.some((m: any) => m.attended);
        const isWinner = winnerMap[team._id];

        return (
          <div
            key={team._id}
            className="mb-5 bg-white shadow rounded-lg p-4 border-l-4 border-blue-600"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-md flex items-center gap-2">
                Registration #{i + 1}
                {isWinner && (
                  <span className="px-2 py-1 text-xs rounded bg-yellow-500 text-white">
                    {isWinner === "FIRST" && "🥇 First"}
                    {isWinner === "SECOND" && "🥈 Second"}
                    {isWinner === "THIRD" && "🥉 Third"}
                  </span>
                )}
              </h3>

              <span
                className={`px-3 py-1 text-xs rounded text-white ${
                  team.paymentStatus === "PAID" ? "bg-green-600" : "bg-blue-500"
                }`}
              >
                {team.paymentStatus}
              </span>
            </div>

            <table className="w-full border text-xs">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Attendance</th>
                  <th className="p-2 border">Prize</th>
                </tr>
              </thead>
              <tbody>
                {team.sortedMembers.map((m: any, idx: number) => (
                  <tr key={idx}>
                    <td className="p-2 border text-center">{idx + 1}</td>
                    <td className="p-2 border font-medium text-center">
                      {m.name}
                    </td>
                    <td className="p-2 border text-center">{m.email}</td>
                    <td className="p-2 border text-center">{m.contact}</td>
                    <td className="p-2 border text-center">
                      {m.attended ? (
                        <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">
                          Participated
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-400 text-white rounded">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="p-2 border text-center">
                      <select
                        value={winnerMap[team._id] || ""}
                        disabled={!hasAttended}
                        className={`border rounded px-2 py-1 text-xs ${
                          !hasAttended ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        onChange={async (e) => {
                          const position = e.target.value;
                          if (!position) return;

                          const token = await getToken();
                          await fetch(
                            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/organizer/events/${eventId}/winner`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                registrationId: team._id,
                                position,
                              }),
                            },
                          );

                          loadWinners();
                        }}
                      >
                        <option value="">
                          {hasAttended ? "Select Prize" : "Not Eligible"}
                        </option>
                        {prizeOptions.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
