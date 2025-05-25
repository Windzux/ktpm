import jwt = require("jsonwebtoken");
export interface paramsSetToken {
  username: string;
  password: string;
  role: string;
}

const expiresIn = 1000 * 60 * 60;
export const createToken = (params: paramsSetToken): any => {
  const { username, role } = params;
  const token = jwt.sign(params, "1111111111111", {
    expiresIn: `${expiresIn}`,
  });
  return token;
};
