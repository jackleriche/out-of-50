import type { NextConfig } from "next";

/**
 * typedRoutes is deliberately off: it rejects links to dynamic segments
 * unless every href is cast, which buys very little on an app this size.
 */
const config: NextConfig = {};

export default config;
