import { spawn } from "node:child_process";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

let apiProcess;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "z-energy-api",
      configureServer() {
        if (apiProcess) return;
        apiProcess = spawn(process.execPath, ["server/index.js"], {
          cwd: process.cwd(),
          stdio: "inherit",
          env: process.env,
        });
        const stop = () => {
          if (apiProcess && !apiProcess.killed) apiProcess.kill();
        };
        process.on("exit", stop);
        process.on("SIGINT", stop);
        process.on("SIGTERM", stop);
      },
    },
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
