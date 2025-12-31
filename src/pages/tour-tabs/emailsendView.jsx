import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingApi from "../../api/ToursApi";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

export default function EmailSendView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setLoading(true);
    bookingApi
      .getBookingById(id)
      .then((res) => {
        const data = res.data;
        setBooking(data);

        setEmailContent(
          `Dear ${data.bookerName},

Your tour booking (${data.referenceId}) has been confirmed.

Route:
${data.route.join(" → ")}

Thank you for choosing TripGenix.`
        );
      })
      .catch((err) => {
        console.error("Failed to load booking", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendEmail = () => {
    setSending(true);

    const payload = {
      bookingId: id,
      email: {
        recipient: booking.bookerEmail,
        subject: `Booking Confirmation - ${booking.referenceId}`,
        msgBody: emailContent,
        attachment: null,
      },
    };

    bookingApi
      .sendConfirmEmail(payload)
      .then(() => {
        toast.success("Email sent successfully");
        navigate("/trips", { state: { reload: true } });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send email");
      })
      .finally(() => setSending(false));
  };

  if (loading) return <div className="p-6">Loading booking details...</div>;
  if (!booking)
    return <div className="p-6 text-red-600">Booking not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-2xl font-semibold">Send Confirmation Email</h2>
      </div>

      {/* BOOKING INFO */}
      <div className="bg-white rounded-xl border shadow-sm p-5 space-y-2">
        <p>
          <b>Reference ID:</b> {booking.referenceId}
        </p>
        <p>
          <b>Customer:</b> {booking.bookerName}
        </p>
        <p>
          <b>Email:</b> {booking.bookerEmail}
        </p>
        <p>
          <b>Route:</b> {booking.route?.join(" → ")}
        </p>
        <p>
          <b>Travel Dates:</b> {booking.startDate?.substring(0, 10)} →{" "}
          {booking.endDate?.substring(0, 10)}
        </p>
      </div>

      {/* EMAIL CONTENT */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <label className="block font-medium mb-2">Email Content</label>
        <textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          rows={8}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={handleSendEmail}
          disabled={sending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg disabled:opacity-50"
        >
          <Send size={16} />
          {sending ? "Sending..." : "Send Email"}
        </button>
      </div>
    </div>
  );
}
