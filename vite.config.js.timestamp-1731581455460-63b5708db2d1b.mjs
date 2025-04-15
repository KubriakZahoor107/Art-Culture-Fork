// vite.config.js
import react from "file:///D:/IT/Art-Culture/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import path from "path";
import { defineConfig } from "file:///D:/IT/Art-Culture/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "D:\\IT\\Art-Culture";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxJVFxcXFxBcnQtQ3VsdHVyZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcSVRcXFxcQXJ0LUN1bHR1cmVcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0lUL0FydC1DdWx0dXJlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG5cdHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuXHRhc3NldHNJbmNsdWRlOiBbYCoqLyoudHRmYF0sXHJcblx0c2VydmVyOiB7XHJcblx0XHRodHRwczoge1xyXG5cdFx0XHRrZXk6IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc2VydmVyLmtleScpKSxcclxuXHRcdFx0Y2VydDogZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzZXJ2ZXIuY2VydCcpKSxcclxuXHRcdH0sXHJcblx0XHRwcm94eToge1xyXG5cdFx0XHQnL2FwaSc6IHtcclxuXHRcdFx0XHR0YXJnZXQ6ICdodHRwczovL2xvY2FsaG9zdDo1MTczLycsXHJcblx0XHRcdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxyXG5cdFx0XHRcdHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHRcdGVzYnVpbGQ6IHtcclxuXHRcdFx0bWluaWZ5SWRlbnRpZmllcnM6IGZhbHNlLFxyXG5cdFx0fSxcclxuXHRcdGJ1aWxkOiB7XHJcblx0XHRcdHNvdXJjZW1hcDogdHJ1ZSxcclxuXHRcdH0sXHJcblx0fSxcclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyTyxPQUFPLFdBQVc7QUFDN1AsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBSDdCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixlQUFlLENBQUMsVUFBVTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNOLEtBQUssR0FBRyxhQUFhLEtBQUssUUFBUSxrQ0FBVyxZQUFZLENBQUM7QUFBQSxNQUMxRCxNQUFNLEdBQUcsYUFBYSxLQUFLLFFBQVEsa0NBQVcsYUFBYSxDQUFDO0FBQUEsSUFDN0Q7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNOLFFBQVE7QUFBQSxRQUNQLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQUEsVUFBUUEsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQzNDO0FBQUEsSUFDRDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsbUJBQW1CO0FBQUEsSUFDcEI7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNOLFdBQVc7QUFBQSxJQUNaO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
