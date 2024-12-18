import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes("-"),
        },
      },
    }),
  ],
  base:'./',
  server:{
    host:'0.0.0.0',
    port:6060
  },
  build:{
    outDir:'docs'
  }
});
