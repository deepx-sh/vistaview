import { getCookieOptions } from "./getCookieOptions.js";
import { generateAccessToken, generateRefreshToken } from "./token.js";

const getToken = async (user, res) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    return {accessToken,refreshToken}
};

export default getToken