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

  /* ================= LOAD BOOKING ================= */
  useEffect(() => {
    setLoading(true);

    bookingApi
      .getBookingById(id)
      .then((res) => {
        const data = res.data;
        setBooking(data);

        // 🔹 Extract required fields safely
        const referenceId = data.referenceId;
        const amount = data.routeDetails.bookingPrice;
        const currency = "LKR";

        const tourId = Number(referenceId.split("-").pop());

        const paymentUrl = `${import.meta.env.VITE_WEB_HOST_URL}/payment/${tourId}`;
        const cancelUrl = `${import.meta.env.VITE_WEB_HOST_URL}/cancel-tour?bookingId=${tourId}`;
        // 🔹 Build email HTML
        setEmailContent(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>TripGenix Booking Confirmation</title>
</head>

<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 15px;">

        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:620px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#1e40af); padding:30px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:28px;">TripGenix</h1>
              <p style="margin:6px 0 0; color:#c7d2fe; font-size:14px;">
                Smart Travel • Seamless Journeys
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:30px; color:#374151; font-size:15px;">

              <p>Dear <b>${data.bookingDetails.nameOfBooker}</b>,</p>

              <p>
                We’re pleased to inform you that your tour booking has been
                <b style="color:#16a34a;"> successfully confirmed</b>.
              </p>

              <!-- BOOKING DETAILS -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f9fafb; border-radius:10px; padding:20px; margin:20px 0;">
                <tr>
                  <td><b>Booking Reference</b></td>
                  <td>${referenceId}</td>
                </tr>

                <tr>
                  <td><b>Route</b></td>
                  <td>${data.tripDetails.destinations.join(" → ")}</td>
                </tr>

                <tr>
                  <td><b>Travel Dates</b></td>
                  <td>${data.tripDetails.startDate} → ${data.tripDetails.endDate}</td>
                </tr>

                <tr>
                  <td><b>Total Amount</b></td>
                  <td style="font-weight:600; color:#1d4ed8;">
                    LKR ${amount}
                  </td>
                </tr>
              </table>

             <!-- PAYMENT BUTTONS -->
<div style="text-align:center; margin:30px 0;">

  <!-- Cancel Tour -->
  <a href="${cancelUrl}"
     style="
       display:inline-block;
       min-width:220px;
       background:#ef4444;
       color:#ffffff;
       padding:16px 0;
       margin:6px;
       border-radius:8px;
       text-decoration:none;
       font-weight:600;
       font-size:16px;
       text-align:center;
     ">
    Cancel Tour
  </a>

  <!-- Make Payment -->
  <a href="${paymentUrl}"
     style="
       display:inline-block;
       min-width:220px;
       background:#2563eb;
       color:#ffffff;
       padding:16px 0;
       margin:6px;
       border-radius:8px;
       text-decoration:none;
       font-weight:600;
       font-size:16px;
       text-align:center;
     ">
    💳 Make Your Payment
  </a>

</div>


              <p style="font-size:14px; color:#4b5563;">
                Please complete your payment using the secure link above to
                proceed with final arrangements.
              </p>

              <p>
                Thank you for choosing <b>TripGenix</b>.<br/>
                We look forward to making your journey unforgettable.
              </p>

              <p style="margin-top:30px;">
                Warm regards,<br/>
                <b>TripGenix Team</b>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f3f4f6; padding:18px; text-align:center; font-size:12px; color:#6b7280;">
              © ${new Date().getFullYear()} TripGenix. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`);
      })
      .catch((err) => {
        console.error("Failed to load booking", err);
        toast.error("Failed to load booking details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= SEND EMAIL ================= */
  const handleSendEmail = () => {
    setSending(true);

    const payload = {
      bookingId: id,
      email: {
        recipient: booking.bookingDetails.bookerEmail,
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

  /* ================= STATES ================= */
  if (loading) return <div className="p-6">Loading booking details...</div>;
  if (!booking)
    return <div className="p-6 text-red-600">Booking not found</div>;

  /* ================= UI ================= */
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
          <b>Customer:</b> {booking.bookingDetails.nameOfBooker}
        </p>
        <p>
          <b>Email:</b> {booking.bookingDetails.bookerEmail}
        </p>
        <p>
          <b>Route:</b> {booking.tripDetails.destinations.join(" → ")}
        </p>
        <p>
          <b>Travel Dates:</b> {booking.tripDetails.startDate} →{" "}
          {booking.tripDetails.endDate}
        </p>
      </div>

      {/* EMAIL PREVIEW */}
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <label className="block font-medium mb-2">Email Preview</label>
        <div
          className="border rounded-lg p-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: emailContent }}
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
