import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "core/index": "src/core/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
});
