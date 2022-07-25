import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
  build: {
    minify: "terser",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Steppp",
      fileName: (format) => `steppp.${format}.js`,
      formats: ["es", "umd"],
    },
  },
});
