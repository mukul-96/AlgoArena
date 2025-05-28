const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const userAuth = (req, res, next) => {
const auth = req.headers.authorization;
    console.log(auth)

    if (!auth || !auth.startsWith("bearer ")) {
        return res.status(401).json({
            msg: "Authorization header is missing or malformed."
        });
    }

    try {
        const token = auth.split(" ")[1];
        const response = jwt.verify(token, JWT_SECRET);

        if (response) {
            req.admin = response; 
            next(); 
        } else {
            return res.status(403).json({
                msg: "Token verification failed. Access denied."
            });
        }
    } catch (error) {
        return res.status(401).json({
            msg: "Authentication failed: " + error.message
        });
    }
};

module.exports = { userAuth };
