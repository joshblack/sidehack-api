import jwt from 'jwt-simple';

function generateJWTToken() {

}

/**
 * JWT Claims
 *
 * Registered Claim Names:
 *
 * "iss"  (Issuer) Claim
 * Should be the sidehack application
 *
 *
 * "sub"  (Subject) Claim
 * The subject of this token. This is the user associated with the relevant
 * action, and may not be present if there is no logged in user.
 *
 *
 * "scope"  Scope
 * Access given to the specific user
 *
 *
 * "exp"  (Expiration Time) Claim
 *
 *
 * "iat"  (Issued At) Claim
 * Issued-at time. Contains the UTC Unix time at which this token was issued.
 *
 *
 */
