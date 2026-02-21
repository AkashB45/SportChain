"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Errors = Record<string, string>;

export default function CreateEventPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    description: "",
    sport: "",
    category: "open",
    date: "",
    venue: "",
    locationUrl: "",
    capacity: 1,
    fee: 0,
    firstPrize: "",
    secondPrize: "",
    thirdPrize: "",
    eventType: "individual",
    teamSize: 1,
    contactName: "",
    contactNumber: "",
    certificateEnabled: false,
    banner: null as File | null,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const validate = () => {
    const e: Errors = {};
    if (!form.title) e.title = "Title required";
    if (!form.description) e.description = "Description required";
    if (!form.sport) e.sport = "Sport required";
    if (!form.date) e.date = "Date required";
    if (!form.venue) e.venue = "Venue required";
    if (!form.locationUrl) e.locationUrl = "Location URL required";
    if (form.capacity <= 0) e.capacity = "Capacity must be > 0";
    if (form.fee < 0) e.fee = "Fee cannot be negative";
    if (form.eventType === "team" && form.teamSize < 2)
      e.teamSize = "Team size must be at least 2";
    if (!form.firstPrize) e.firstPrize = "First prize required";
    if (!form.contactName) e.contactName = "Contact name required";
    if (!form.contactNumber) e.contactNumber = "Contact number required";
    if (!form.banner) e.banner = "Banner required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);

    const token = await getToken();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v as any));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/create`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    setLoading(false);
    if (res.ok) router.push("/dashboard/organizer");
  };

  const Field = ({ label, err, ...props }: any) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        {...props}
        className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white ${
          err ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
      />
      {err && <span className="text-red-500 text-xs">{err}</span>}
    </div>
  );

  const Section = ({ title, icon, children }: any) => (
    <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        <h1 className="text-4xl font-extrabold text-center text-gray-800">
          🏟 Create Sports Event
        </h1>

        <Section title="Basic Details" icon="📝">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Event Title" err={errors.title} onChange={(e:any)=>set("title",e.target.value)} />
            <Field label="Sport" err={errors.sport} onChange={(e:any)=>set("sport",e.target.value)} />
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea
                className={`border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                rows={3}
                onChange={(e)=>set("description",e.target.value)}
              />
              {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
            </div>
          </div>
        </Section>

        <Section title="Schedule & Category" icon="📅">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select className="border rounded-lg px-3 py-2 w-full" onChange={(e)=>set("category",e.target.value)}>
                <option value="open">Open</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <Field type="date" min={today} label="Event Date" err={errors.date} onChange={(e:any)=>set("date",e.target.value)} />
            <Field label="Venue" err={errors.venue} onChange={(e:any)=>set("venue",e.target.value)} />
          </div>
        </Section>

        <Section title="Location & Limits" icon="📍">
          <div className="grid md:grid-cols-3 gap-6">
            <Field label="Google Maps URL" err={errors.locationUrl} onChange={(e:any)=>set("locationUrl",e.target.value)} />
            <Field type="number" min={1} label="Capacity" err={errors.capacity} onChange={(e:any)=>set("capacity",Number(e.target.value))} />
            <div>
              <Field type="number" min={0} label="Event Fee ₹" err={errors.fee} onChange={(e:any)=>set("fee",Number(e.target.value))} />
              <p className="text-sm text-gray-500 mt-1">
                {form.fee === 0 ? "🆓 Free Event" : `💰 Paid Event – ₹${form.fee}`}
              </p>
            </div>
          </div>
        </Section>

        <Section title="Event Format" icon="👥">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">Event Type</label>
              <select className="border rounded-lg px-3 py-2 w-full" onChange={(e)=>set("eventType",e.target.value)}>
                <option value="individual">Individual</option>
                <option value="team">Team</option>
              </select>
            </div>
            {form.eventType==="team" && (
              <Field type="number" min={2} label="Team Size" err={errors.teamSize} onChange={(e:any)=>set("teamSize",Number(e.target.value))} />
            )}
          </div>
        </Section>

        <Section title="Prizes" icon="🏆">
          <div className="grid md:grid-cols-3 gap-6">
            <Field label="🥇 First Prize" err={errors.firstPrize} onChange={(e:any)=>set("firstPrize",e.target.value)} />
            <Field label="🥈 Second Prize (optional)" onChange={(e:any)=>set("secondPrize",e.target.value)} />
            <Field label="🥉 Third Prize (optional)" onChange={(e:any)=>set("thirdPrize",e.target.value)} />
          </div>
        </Section>

        <Section title="Contact Details" icon="📞">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Contact Name" err={errors.contactName} onChange={(e:any)=>set("contactName",e.target.value)} />
            <Field label="Contact Number" err={errors.contactNumber} onChange={(e:any)=>set("contactNumber",e.target.value)} />
          </div>
        </Section>

        <Section title="Extras" icon="✨">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Enable Certificates</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" onChange={(e)=>set("certificateEnabled",e.target.checked)} />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        </Section>

        <Section title="Event Banner" icon="🖼">
          <input type="file" onChange={(e)=>set("banner",e.target.files![0])} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
          {errors.banner && <p className="text-red-500 text-xs mt-1">{errors.banner}</p>}
        </Section>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:opacity-90 transition"
        >
          {loading ? "Creating Event..." : "🚀 Create Event"}
        </button>

      </div>
    </div>
  );
}
