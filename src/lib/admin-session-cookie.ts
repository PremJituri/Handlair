/** HTTPS sessions also work inside a cross-site editor iframe via CHIPS.
 * Local HTTP keeps Strict cookies; CSRF middleware remains enabled for RPCs. */
export function adminSessionCookie(requestUrl: string, forwardedProtocol?: string | null) {
  const secure =
    new URL(requestUrl).protocol === "https:" ||
    forwardedProtocol?.split(",")[0]?.trim() === "https";
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? ("none" as const) : ("strict" as const),
    partitioned: secure,
    path: "/",
  };
}
