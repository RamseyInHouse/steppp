import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "../../setupTests.js",
  },
  build: {
    minify: "terser",
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "Steppp",
      fileName: (format) => `steppp-react.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
