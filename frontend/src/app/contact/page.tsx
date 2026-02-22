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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* HERO */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions, collaboration ideas, or feedback? Let’s build something impactful together.
          </p>
        </div>

        {/* CONTACT CONTAINER */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 grid md:grid-cols-2 gap-12">

          {/* LEFT — FORM */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-purple-300">
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
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400 transition"
              />

              <input
                type="email"
                name="email"
                required
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400 transition"
              />

              <textarea
                name="message"
                required
                placeholder="Your Message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-400 transition"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-purple-500/40"
              >
                Send Message via Gmail 🚀
              </button>
            </form>
          </div>

          {/* RIGHT — DEVELOPER CARD */}
          <div className="relative bg-gradient-to-br from-purple-700/40 to-blue-700/40 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-xl">

            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-2xl opacity-40"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 text-blue-300">
                About the Developer
              </h2>

              <p className="text-sm leading-relaxed text-gray-300 mb-4">
                Hi, I’m <span className="font-semibold text-white">Akash Balaji</span>,
                a <span className="font-semibold text-white">Full-Stack Developer</span>
                specializing in scalable web apps using
                <span className="font-semibold text-white"> MERN Stack</span>,
                cloud technologies, and modern UI systems.
              </p>

              <p className="text-sm leading-relaxed text-gray-300 mb-4">
                I’ve built production-level systems including
                Real Estate Platforms, AI-powered Chatbots,
                Blockchain-integrated dashboards, and secure admin panels.
              </p>

              <p className="text-sm leading-relaxed text-gray-300">
                Currently exploring opportunities in
                <span className="font-semibold text-white"> Software Engineering</span>,
                <span className="font-semibold text-white"> Cloud</span>, and
                <span className="font-semibold text-white"> DevOps</span>.
              </p>

              {/* CONTACT LINKS */}
              <div className="mt-8 space-y-3 text-sm">
                <p>
                  📧 Email:{" "}
                  <a
                    href="mailto:akashbalaji594@gmail.com"
                    className="underline hover:text-purple-300 transition"
                  >
                    akashbalaji594@gmail.com
                  </a>
                </p>

                <p>
                  💼 LinkedIn:{" "}
                  <a
                    href="https://www.linkedin.com/in/akash-b-a92b30230/"
                    target="_blank"
                    className="underline hover:text-purple-300 transition"
                  >
                    linkedin.com/in/akash-balaji
                  </a>
                </p>

                <p>
                  🌐 Portfolio:{" "}
                  <a
                    href="https://akashbalaji.vercel.app/"
                    target="_blank"
                    className="underline hover:text-purple-300 transition"
                  >
                    akashbalaji.vercel.app
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER NOTE */}
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} SportChain • Built with Next.js & Blockchain Innovation
        </div>

      </div>
    </div>
  );
}