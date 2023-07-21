import  jwt from "jsonwebtoken";

import { Request,Response,NextFunction} from "express";

interface userData {
    userId  : number;
    firstName : string;
    email : string
    isAdmin : Boolean;
    role : string
}

// generate token

export const generateToken = (user : userData) =>{
    const payload = user;
    return jwt.sign(payload, process.env.Secret_Key|| 'SECTER-KEY**', {
    
        expiresIn : '1d',

    });

};


 export  interface customerUserRequest extends Request {

    user?:{
        userId: number;
        firstName : string;
        email : string
        isAdmin : Boolean
    }

}


// //Decoded


export const decodeToken = (req:customerUserRequest,res : Response,next : NextFunction) =>{
    try {
        const token = req.headers.authorization?.startsWith("Bearer") &&
        req.headers.authorization?.split(' ')[1] 
        
       
        if(!token)
        return res.json({
            isSuccess : false,
            message : "u don't have Token"
        });


        const decode:{userId:number; firstName : string ; email : string; isAdmin:Boolean ;
            role : string} | any = 
           jwt.verify(token,process.env.Secret_Key || "SECTER-KEY**");

            req.user = {...decode};
            next()
        
    } catch (error) {
        res.json(
            {
                isSuccess : false,
                message  : "u don't have Token".toUpperCase()
            }
        )
    }
}
//===================================================================
//===================================================================
//===================================================================
//===================================================================
//======================| new practice |============================ 
//===================================================================
//===================================================================
//===================================================================


