import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      // these are the aliases and paths to them
      $functions: path.resolve("src", "functions"),
      $: path.resolve("src"),
      $icons: path.resolve("src", "lib", "icons"),
      $lib: path.resolve("src", "lib"),
      $routes: path.resolve("src", "routes"),
    },
  },
});
