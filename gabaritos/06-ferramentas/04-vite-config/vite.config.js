export default {
  base: "/racha-conta/",
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: false,
  },
  envPrefix: "APP_",
  resolve: {
    alias: { "@": "/src" },
  },
};
