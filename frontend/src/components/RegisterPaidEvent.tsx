"use client";

import { useAuth } from "@clerk/nextjs";

export default function RegisterPaidEvent({
  event,
  members,
  disabled,
  onSuccess,
}: {
  event: any;
  members: any[];
  disabled: boolean;
  onSuccess: () => void;
}) {
  const { getToken } = useAuth();

  const handlePayment = async () => {
    const token = await getToken();

    const orderRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          amount: event.fee,
        }),
      }
    );

    const order = await orderRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: "INR",
      name: "SportChain",
      description: event.title,
      order_id: order.id,

      handler: async (response: any) => {
        const token = await getToken();

        const verifyRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event._id,
              members: members, // ✅ FIX
            }),
          }
        );

        if (!verifyRes.ok) {
          alert("Payment verification failed");
          return;
        }

        onSuccess();
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <button 
      disabled={disabled}
      onClick={handlePayment}
      className="w-full py-3 rounded-lg text-white font-semibold text-lg
      bg-gradient-to-r from-blue-500 to-green-500
      hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
    >
      Register & Pay ₹{event.fee}
    </button>
  );
}
