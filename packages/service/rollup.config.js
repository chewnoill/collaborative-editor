import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/service.ts",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [typescript(), commonjs(), json(), nodeResolve()],
};
