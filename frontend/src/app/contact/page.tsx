"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, message } = formData;

    const subject = encodeURIComponent(`New Contact Message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=akashbalaji594@gmail.com&su=${subject}&body=${body}`;

    window.open(gmailURL, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg">
            Have questions, feedback, or collaboration ideas? I’d love to hear from you.
          </p>
        </div>

        {/* CONTACT CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-10 grid md:grid-cols-2 gap-12">

          {/* LEFT — CONTACT FORM */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send a Message
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <input
                type="email"
                name="email"
                required
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <textarea
                name="message"
                required
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Send Message via Gmail
              </button>
            </form>
          </div>

          {/* RIGHT — ABOUT YOU */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">About the Developer</h2>

            <p className="text-sm leading-relaxed mb-4">
              Hi, I’m <span className="font-semibold">Akash Balaji</span>, a
              <span className="font-semibold"> Full-Stack Developer</span> with
              hands-on experience in building scalable web applications using
              <span className="font-semibold"> MERN Stack</span>, cloud technologies,
              and modern UI frameworks.
            </p>

            <p className="text-sm leading-relaxed mb-4">
              I’ve worked on real-world projects like
              <span className="font-semibold"> Real Estate Management Systems</span>,
              <span className="font-semibold"> AI-powered Chatbots</span>, and secure
              admin dashboards, focusing on performance and clean architecture.
            </p>

            <p className="text-sm leading-relaxed">
              I’m actively exploring opportunities in
              <span className="font-semibold"> Software Development</span>,
              <span className="font-semibold"> Cloud</span>, and
              <span className="font-semibold"> DevOps</span>.
            </p>

            <div className="mt-6 text-sm space-y-2">
              <p>
                📧 Email:{" "}
                <a
                  href="mailto:akashbalaji594@gmail.com"
                  className="font-medium underline hover:text-gray-200"
                >
                  akashbalaji594@gmail.com
                </a>
              </p>

              <p>
                💼 LinkedIn:{" "}
                <a
                  href="https://www.linkedin.com/in/akash-b-a92b30230/"
                  target="_blank"
                  className="font-medium underline hover:text-gray-200"
                >
                  linkedin.com/in/akash-balaji
                </a>
              </p>

              <p>
                🌐 Portfolio:{" "}
                <a
                  href="https://akashbalaji.vercel.app/"
                  target="_blank"
                  className="font-medium underline hover:text-gray-200"
                >
                  akashbalaji.vercel.app
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}