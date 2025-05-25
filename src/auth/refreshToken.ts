import * as jwt from "jsonwebtoken";
import { UserBLL } from "../user/user.bll";
import { UserNS } from "../user/user";

export const refreshToken = async (
  params: UserNS.refreshToken,
  userBll: UserBLL
): Promise<string> => {
  if (!params.token) {
    throw new Error("Token is required for refresh");
  }

  try {
    const decoded = jwt.verify(
      params.token,
      process.env.SECRET || "your-secret-key"
    ) as { username: string; role: string };
    const user = await userBll.findUserByUsername(decoded.username);

    if (!user) throw new Error("User not found");

    const newToken = jwt.sign(
      { username: user.username, role: user.role },
      process.env.SECRET || "your-secret-key",
      { expiresIn: process.env.expTime || "1h" }
    );
    return newToken;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const decoded = jwt.decode(params.token) as {
        username: string;
        role: string;
      };
      const user = await userBll.findUserByUsername(decoded.username);

      if (!user) throw new Error("User not found");

      const newToken = jwt.sign(
        { username: user.username, role: user.role },
        process.env.SECRET || "your-secret-key",
        { expiresIn: process.env.expTime || "1h" }
      );
      return newToken;
    }
    throw new Error("Invalid refresh token");
  }
};
