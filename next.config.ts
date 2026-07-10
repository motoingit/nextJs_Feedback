import type { NextConfig } from "next";
import "./lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.29.138"],
};

export default nextConfig;
