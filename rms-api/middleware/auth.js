const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const dotenv = require('dotenv');

dotenv.config();

const tenant = process.env.AAD_TENANT_ID || 'common';
const jwksUri = `https://login.microsoftonline.com/${tenant}/discovery/v2.0/keys`;
const client = jwksClient({ jwksUri, cache: true, rateLimit: true });

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) return callback(err);
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

const roleMiddleware = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ message: "Authorization header missing!" });
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Token missing!" });
            }

            const verifyOptions = {};

            if (process.env.AAD_CLIENT_ID) verifyOptions.audience = `api://${process.env.AAD_CLIENT_ID}`;
            verifyOptions.issuer = `https://sts.windows.net/${tenant}/`;

            jwt.verify(token, getKey, verifyOptions, (err, decoded) => {
                if (err) {
                    console.error('Token verification error:', err);
                    return res.status(401).json({ message: "Invalid or expired token!" });
                }

                req.user = decoded;

                // roles can be in 'roles', 'role', 'scp' or 'groups' depending on the token
                let tokenRoles = decoded.roles || decoded.role || decoded.scp || decoded.groups || [];
                if (!Array.isArray(tokenRoles)) tokenRoles = [tokenRoles].filter(Boolean);

                if (roles.length && !tokenRoles.some(r => roles.includes(r))) {
                    return res.status(403).json({ message: "Forbidden: You don't have the required role!" });
                }

                next();
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal jwt server error!" });
        }
    };

};

module.exports = roleMiddleware;