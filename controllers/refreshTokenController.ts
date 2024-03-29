
import { Request, Response } from 'express';
import { User } from '../models';
import jwt from 'jsonwebtoken';
import UsersMongooseModel from '../models/schemas/userSchema';



const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser =await  UsersMongooseModel.findOne<User>({refreshToken}).exec() as unknown as User ; // exec is needed when working with async, await
    if (!foundUser) return res.sendStatus(403); // Forbidden

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        (err:any,decoded:any)=> {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accesToken = jwt.sign(
                { "UserInfo": {
                    "username": decoded.username,
                    "roles":roles
                }},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: '30s'}
            )
            res.json({accesToken});
        }
    )


}

export default handleRefreshToken;