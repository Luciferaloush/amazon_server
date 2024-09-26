const jwt = require('jsonwebtoken');

const auth = async (req, res,next) => {
          try{
                    const token = req.header('token');
                    if(!token)
                              return res.status(401).json({msg : "No token available"});
                    
                    const verified = jwt.verify(token , 'passwordKey');
                    if(!verified) return res.status(401).json({msg : "Token verification failed"});

                    req.user = verified.id;
                    req.token = token;
                    next();

          }catch(e){
                    console.error(e); // Log the error details

                    res.status(500).json({ msg: "Server error" });

          }
}
module.exports = auth;
