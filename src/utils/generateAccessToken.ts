import jwt from 'jsonwebtoken';

const generateAccessToken = (userId: string) => {
	return jwt.sign({ _id: userId }, process.env.JWT_KEY!, { expiresIn: '10s' });
};

export default generateAccessToken;
