const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenService {
	constructor() {
		this.tokenSecret = null;
	}

	createToken(data) {
		this.tokenSecret = process.env.TOKEN;
		return jwt.sign(data, this.tokenSecret, {
			expiresIn: process.env.TOKEN_TIME_EXP
		});
	}

	verifyToken(token) {
		this.tokenSecret = process.env.TOKEN;
		return new Promise((resolve, reject) => {
			jwt.verify(token, this.tokenSecret, (err, decoded) => {
				if (err) {
					return reject(err.message);
				}
				return resolve(decoded.email);
			});
		});
	}
}

module.exports = new TokenService();
