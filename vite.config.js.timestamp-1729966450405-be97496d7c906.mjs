// vite.config.js
import react from "file:///F:/FullStack%20Js/Portfolio%20site/Art-Culture/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import path from "path";
import { defineConfig } from "file:///F:/FullStack%20Js/Portfolio%20site/Art-Culture/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "F:\\FullStack Js\\Portfolio site\\Art-Culture";
var vite_config_default = defineConfig({
  plugins: [react()],
  assetsInclude: [`**/*.ttf`],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__vite_injected_original_dirname, "server.key")),
      cert: fs.readFileSync(path.resolve(__vite_injected_original_dirname, "server.cert"))
    },
    proxy: {
      "/api": {
        target: "https://localhost:5173/",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    },
    esbuild: {
      minifyIdentifiers: false
    },
    build: {
      sourcemap: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxGdWxsU3RhY2sgSnNcXFxcUG9ydGZvbGlvIHNpdGVcXFxcQXJ0LUN1bHR1cmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXEZ1bGxTdGFjayBKc1xcXFxQb3J0Zm9saW8gc2l0ZVxcXFxBcnQtQ3VsdHVyZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovRnVsbFN0YWNrJTIwSnMvUG9ydGZvbGlvJTIwc2l0ZS9BcnQtQ3VsdHVyZS92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuXHRwbHVnaW5zOiBbcmVhY3QoKV0sXHJcblx0YXNzZXRzSW5jbHVkZTogW2AqKi8qLnR0ZmBdLFxyXG5cdHNlcnZlcjoge1xyXG5cdFx0aHR0cHM6IHtcclxuXHRcdFx0a2V5OiBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NlcnZlci5rZXknKSksXHJcblx0XHRcdGNlcnQ6IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc2VydmVyLmNlcnQnKSksXHJcblx0XHR9LFxyXG5cdFx0cHJveHk6IHtcclxuXHRcdFx0Jy9hcGknOiB7XHJcblx0XHRcdFx0dGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6NTE3My8nLFxyXG5cdFx0XHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuXHRcdFx0XHRyZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRlc2J1aWxkOiB7XHJcblx0XHRcdG1pbmlmeUlkZW50aWZpZXJzOiBmYWxzZSxcclxuXHRcdH0sXHJcblx0XHRidWlsZDoge1xyXG5cdFx0XHRzb3VyY2VtYXA6IHRydWUsXHJcblx0XHR9LFxyXG5cdH0sXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsT0FBTyxXQUFXO0FBQzlVLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUg3QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMzQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsZUFBZSxDQUFDLFVBQVU7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTixLQUFLLEdBQUcsYUFBYSxLQUFLLFFBQVEsa0NBQVcsWUFBWSxDQUFDO0FBQUEsTUFDMUQsTUFBTSxHQUFHLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGFBQWEsQ0FBQztBQUFBLElBQzdEO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUFBLFVBQVFBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUMzQztBQUFBLElBQ0Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNSLG1CQUFtQjtBQUFBLElBQ3BCO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTixXQUFXO0FBQUEsSUFDWjtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
