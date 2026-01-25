import React, { useEffect } from "react";
import { Client } from "@stomp/stompjs";

function DriverConfirmed() {
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8081/ws",
      reconnectDelay: 5000,
      debug: (str) => console.log(str),

      onConnect: () => {
        console.log("✅ WebSocket connected");

        client.subscribe("/topic/tour-updates", (message) => {
          const data = JSON.parse(message.body);
          console.log("Tour update:", data);
        });
      },

      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
      },

      onWebSocketClose: () => {
        console.warn("⚠️ WebSocket connection closed");
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, []);

  return <div>DriverConfirmed</div>;
}

export default DriverConfirmed;
