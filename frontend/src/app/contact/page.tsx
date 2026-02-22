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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-10">

        {/* SIDEBAR (Same Style as Privacy) */}
        <div className="md:col-span-1 sticky top-20 h-fit space-y-4 text-sm">
          <a href="#form" className="block hover:text-blue-400">
            Send Message
          </a>
          <a href="#info" className="block hover:text-blue-400">
            Contact Info
          </a>
          <a href="#about" className="block hover:text-blue-400">
            About Developer
          </a>
        </div>

        {/* MAIN CONTENT (Same structure as Privacy content) */}
        <div className="md:col-span-3 space-y-12">

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Contact Us
          </h1>

          {/* FORM SECTION */}
          <section id="form">
            <h2 className="text-2xl font-semibold mb-6">
              Send a Message
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
              />

              <input
                type="email"
                name="email"
                required
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
              />

              <textarea
                name="message"
                required
                rows={5}
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition"
              >
                Send Message via Gmail
              </button>
            </form>
          </section>

          {/* CONTACT INFO */}
          <section id="info">
            <h2 className="text-2xl font-semibold mb-3">
              Contact Information
            </h2>

            <p className="text-gray-300 mb-2">
              📧 akashbalaji594@gmail.com
            </p>

            <p className="text-gray-300">
              💼 linkedin.com/in/akash-balaji
            </p>
          </section>

          {/* ABOUT */}
          <section id="about">
            <h2 className="text-2xl font-semibold mb-3">
              About the Developer
            </h2>

            <p className="text-gray-300 mb-4">
              Hi, I’m <span className="text-white font-semibold">Akash Balaji</span>,
              a Full-Stack Developer specializing in MERN stack,
              cloud technologies, and blockchain-integrated systems.
            </p>

            <p className="text-gray-300">
              I focus on building scalable, secure, and production-ready web
              applications with clean architecture and strong UI design.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}