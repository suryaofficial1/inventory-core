import jwt from 'jsonwebtoken';
import authModel from '../Models/AuthModel.js';
import { getErrorObject } from '../utils/responseUtil.js';

/**
 * middleware to authorize request with JWT Token, if token is not present or invalid give 401 else call next.
 * Token may be present in header, body, query.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export default async function authorize(req, res, next) {
  try {
    const bearerToken = extractToken(req);
    if (bearerToken != null) {
      // Set the token
      const token = bearerToken;
      const data = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("data", data, token)
      if (data.id) {
        req.token = token;
        req.user = data;
        // Next middleware
        if (next) {
          next();
        }
        return true;
      } else {
        // UNAUTHORIZED
        res.send(getErrorObject(401, "invalid token"))
      }
    } else {
      res.send(getErrorObject(401, "invalid token"))
      // UNAUTHORIZED
    }
    return false
  } catch (error) {
    console.error('Error in verifyToken', error);
    res.status(500).send({ error: error });
  }
}

export function extractToken(req) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    if (typeof bearerToken !== 'undefined' && bearerToken.length > 15)
      return bearerToken;

  }
  if (req.body && typeof req.body['token'] !== 'undefined') {

    return req.body['token'];
  }

  if (req.query && typeof req.query['token'] !== 'undefined') {

    return req.query['token'];
  }

  return null
}


/**
 * perform authorization for Super admin role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export async function authorizeSuperAdmin(req, res, next) {
  try {
    const { user } = req
    var result = await authModel.getUserById(user.id);
    if (result.role === "Admin") {
      next();	// then preform next action given
    } else
      return res.send(getErrorObject(403, "You are not authorized to perform this action"));
  } catch (err) {
    res.send(getErrorObject(500, "Internal Server Error", err));
  }
}
