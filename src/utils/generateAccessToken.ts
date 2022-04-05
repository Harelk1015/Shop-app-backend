import jwt from 'jsonwebtoken';

const generateAccessToken = (userId: string) => {
  return jwt.sign({_id : userId}, 'secret', { expiresIn: '10s' });
};

export default generateAccessToken
