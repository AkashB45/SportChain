import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!(window as any).ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  const provider = new ethers.BrowserProvider(
    (window as any).ethereum
  );

  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return address;
};
