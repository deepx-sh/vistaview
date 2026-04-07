const isProduction = process.env.NODE_ENV === "production";
const isCrossSite = isProduction ? true : false;

export const getCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: isProduction ? isCrossSite ? "none":"lax":"lax",
    maxAge,
    path:"/"
})