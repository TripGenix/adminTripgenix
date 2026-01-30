import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { buffer } from "stream/consumers";

export default defineConfig({
  plugins: [react()],
   server: {
    port: 5174,      
    strictPort: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer",
    },
  },

  define: {
    global: {},
  },

});
