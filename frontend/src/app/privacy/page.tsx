export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-10">
        
        {/* Sidebar */}
        <div className="md:col-span-1 sticky top-20 h-fit space-y-4 text-sm">
          <a href="#collection" className="block hover:text-blue-400">Data Collection</a>
          <a href="#usage" className="block hover:text-blue-400">Usage</a>
          <a href="#blockchain" className="block hover:text-blue-400">Blockchain Notice</a>
          <a href="#rights" className="block hover:text-blue-400">User Rights</a>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <section id="collection">
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <p className="text-gray-300">
              Name, email, wallet address, transaction hashes, device information, and usage logs.
            </p>
          </section>

          <section id="usage">
            <h2 className="text-2xl font-semibold mb-3">How We Use Data</h2>
            <p className="text-gray-300">
              To manage accounts, process registrations, mint NFT certificates,
              and verify organizer authenticity.
            </p>
          </section>

          <section id="blockchain">
            <h2 className="text-2xl font-semibold mb-3">Blockchain Transparency</h2>
            <p className="text-gray-300">
              Blockchain transactions are public and immutable. Wallet addresses
              may permanently link to event participation records.
            </p>
          </section>

          <section id="rights">
            <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
            <p className="text-gray-300">
              You may request access, correction, or deletion of personal data
              (excluding immutable blockchain records).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}