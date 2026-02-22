export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white px-6 py-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Sidebar */}
        <div className="md:col-span-1 sticky top-20 h-fit space-y-4 text-sm">
          <a href="#roles" className="block hover:text-purple-400">User Roles</a>
          <a href="#wallet" className="block hover:text-purple-400">Wallet Ownership</a>
          <a href="#nft" className="block hover:text-purple-400">NFT Certificates</a>
          <a href="#liability" className="block hover:text-purple-400">Liability</a>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>

          <section id="roles">
            <h2 className="text-2xl font-semibold mb-3">User Roles</h2>
            <p className="text-gray-300">
              Users must register as Participant or Organizer.
              Fake identities and impersonation are prohibited.
            </p>
          </section>

          <section id="wallet">
            <h2 className="text-2xl font-semibold mb-3">Wallet Ownership</h2>
            <p className="text-gray-300">
              By connecting your wallet, you confirm ownership and accept
              blockchain transaction risks.
            </p>
          </section>

          <section id="nft">
            <h2 className="text-2xl font-semibold mb-3">NFT Certificates</h2>
            <p className="text-gray-300">
              Certificates are minted on blockchain and cannot be revoked
              once confirmed.
            </p>
          </section>

          <section id="liability">
            <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="text-gray-300">
              SportChain is not responsible for blockchain network failures,
              gas fees, or external wallet compromises.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}