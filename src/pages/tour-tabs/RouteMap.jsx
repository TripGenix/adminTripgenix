import { useEffect, useRef, useState } from "react";

export default function RouteMap({
  routeDetails,
  setRouteDetails,
  tripDetails, // ✅ MUST BE PASSED
}) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const [summary, setSummary] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);

  /* =============================
     MAP + ROUTE LOGIC
  ============================= */
  useEffect(() => {
    const g = window.google;

    // ✅ SAFETY GUARDS
    if (
      !g ||
      !g.maps ||
      !g.maps.geometry ||
      !routeDetails ||
      !routeDetails.routeData ||
      !tripDetails
    )
      return;

    if (!mapInstance.current) {
      mapInstance.current = new g.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 7.8731, lng: 80.7718 },
      });
    }

    const route = routeDetails.routeData.routes[0];
    const legs = route.legs;

    let totalDist = 0;
    let totalDur = 0;

    const legsSummary = legs.map((leg) => {
      totalDist += leg.distance.value;
      totalDur += leg.duration.value;

      return {
        start: leg.start_address,
        end: leg.end_address,
        dist: leg.distance.text,
        time: leg.duration.text,
      };
    });

    const totalKm = (totalDist / 1000).toFixed(2);
    const hrs = Math.floor(totalDur / 3600);
    const mins = Math.floor((totalDur % 3600) / 60);

    const orderedStops =
      route.waypoint_order?.map((i) => tripDetails.destinations[i]) || [];

    setSummary({
      legsSummary,
      totalKm,
      totalTimeText: `${hrs} hrs ${mins} mins`,
      orderedStops,
    });

    setRouteDetails((prev) => ({
      ...prev,
      distance: Number(totalKm),
      duration: Math.floor(totalDur / 60),
    }));

    /* -------- CLEAR OLD MAP -------- */
    window.currentRouteLine?.setMap(null);
    window.routeMarkers?.forEach((m) => m.setMap(null));

    window.routeMarkers = [];

    /* -------- DRAW POLYLINE -------- */
    const decoded = g.maps.geometry.encoding.decodePath(
      route.overview_polyline.points,
    );

    window.currentRouteLine = new g.maps.Polyline({
      path: decoded,
      geodesic: true,
      strokeColor: "#007aff",
      strokeOpacity: 0.85,
      strokeWeight: 4,
    });

    window.currentRouteLine.setMap(mapInstance.current);

    const bounds = new g.maps.LatLngBounds();
    decoded.forEach((p) => bounds.extend(p));
    mapInstance.current.fitBounds(bounds);

    /* -------- MARKERS -------- */
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // START
    window.routeMarkers.push(
      new g.maps.Marker({
        map: mapInstance.current,
        position: legs[0].start_location,
        label: labels[0],
        title: tripDetails.startLocation,
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      }),
    );

    // WAYPOINTS + END
    legs.forEach((leg, i) => {
      const isLast = i === legs.length - 1;

      window.routeMarkers.push(
        new g.maps.Marker({
          map: mapInstance.current,
          position: leg.end_location,
          label: labels[i + 1],
          title: leg.end_address,
          icon: isLast
            ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        }),
      );
    });
  }, [routeDetails?.routeData]);

  /* =============================
     RENDER
  ============================= */
  return (
    <div className="w-full bg-white/60 backdrop-blur-xl border shadow rounded-2xl p-8">
      <div className="space-y-3 text-lg">
        <Row label="Distance" value={`${summary?.totalKm || 0} km`} />
        <Row label="Duration" value={summary?.totalTimeText || "-"} />
      </div>

      <h2 className="text-center text-xl font-medium mt-6">Route Preview</h2>

      <div ref={mapRef} className="w-full h-72 rounded-lg border my-4" />

      {/* ORDERED ROUTE */}
      {summary && (
        <div className="bg-white border p-5 rounded-xl shadow-sm text-sm space-y-3 mt-4">
          <p>
            <b>A</b> — {tripDetails.startLocation}
          </p>

          {summary.orderedStops.map((stop, i) => (
            <p key={i}>
              <b>{String.fromCharCode(66 + i)}</b> — {stop}
            </p>
          ))}

          <p>
            <b>{String.fromCharCode(66 + summary.orderedStops.length)}</b> —{" "}
            {tripDetails.endLocation}
          </p>

          <button
            type="button"
            onClick={() => setOpenDetails(true)}
            className="w-full border border-green-600 text-green-700 py-2 rounded-lg"
          >
            See Full Route Details
          </button>
        </div>
      )}

      {/* FULL DETAILS MODAL */}
      {openDetails && summary && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white max-w-3xl w-full p-6 rounded-xl">
            <button
              onClick={() => setOpenDetails(false)}
              className="absolute top-3 right-4 text-xl"
            >
              ✕
            </button>

            {summary.legsSummary.map((l, i) => (
              <div key={i} className="border p-4 rounded mb-3">
                <p className="font-semibold">
                  {l.start.split(",")[0]} → {l.end.split(",")[0]}
                </p>
                <p>Distance: {l.dist}</p>
                <p>Duration: {l.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- HELPER ---------------- */

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-2">
      <span>{label} :</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
