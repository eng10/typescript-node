import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();
import {Request, Response} from 'express'

import bcrypt from 'bcryptjs'
import {  customerUserRequest, generateToken } from '../helpers/security/jwt';



interface userLogin{
    email:string;
    password : string
}

interface userReg{
    firstName : string
    lastName : string
    password: string
    email : string
}

// User-Registation

 export const Register = async (req : Request, res : Response)=>{
  const {firstName , lastName, email,password} = req.body as userReg

  if(!firstName || !lastName ||!email ||!password){
    const error = {
        message : "provide data set"
    }
    res.json(error)
    return

  }


  const checkuser = await prisma.user.findFirst({
    where:{
        email
    }
  }) 

  if(checkuser){
   return res.json({
        message : "your email already axist",
        Error
    })
  }

  // hash password


  const hashed = bcrypt.hashSync(password)

  const newUser = await prisma.user.create({
    data:{
        firstName,
        lastName,
        email,
        password : hashed,
        isAdmin : email === "cabdilahi@gmail.com" ? true : false,
        role : email === "cabdilahi@gmail.com" ? "SUPERADMIN" : "USER"
        
    }

    
})
res.json({
    message: "Successfull",
    newUser
})


}
// login 


  export  const login = async (req : Request, res: Response)=>{
    const {email,password} = req.body as userLogin

    if(!email|| !password){
         res.json({
            message : "Inter Your data",
            Error
         })
    }

    const user = await prisma.user.findFirst({
        where:{
            email,
        },
       


    })
    if(!user){
        res.json({
            message : "something went wrong",
            Error
        })
        return
    }

    //hello

    const dehashed = bcrypt.compareSync(password, user.password)

    if (!dehashed) {
        return res.json({
            message : "something went wrong",
        });
        
      }
    
      const result = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        CreatedAt: user.createdAt,
        token : generateToken({
            userId : user.id,
            firstName : user.firstName,
            email : user.email,
            isAdmin : user.isAdmin
        })
      };
    
      res.json(result);
}


// gell all 

 export const getall = async(req:Request, res:Response)=>{
    try {
        const userdata = await prisma.user.findMany({
          select :{
            id :true,
            isAdmin:true,
            firstName:true,
            lastName:true,
            email:true,
            role : true,
            updatedAt : true,
            createdAt : true
          }
        });
    res.json({
        userdata
    })
    } catch (error) {
        error
    }
}

//get one

export const one = async(req:Request,res:Response)=>{
    try {
        const {id} = req.params
        const checkid = await prisma.user.findFirst({
            where:{
                id:+id
            },
            select :{
                id :true,
                isAdmin:true,
                firstName:true,
                lastName:true,
                email:true,
                role : true,
                updatedAt : true,
                createdAt : true
            }
        })
        if(!checkid){
            return res.json({
                message : `user ${id} is not axist`,
                isSuccess : false
            })
        }
        res.json({
            checkid,
            isSuccess : false
        })

    } catch (error) {
        res.json({
            isSuccess :false,
            error
        })
    }
}



// Make User-Admin




export const makeAdmin = async(req:customerUserRequest,res:Response)=>{
    const{role} = req.body
    if(!req.user?.isAdmin){
     return res.json({
         message : "unAdmin or UnSupperAdmin",
         isSuccess : false
      })
    }
  
    const user = await prisma.user.findFirst({
        where:{
            id: req.user?.userId
        }

    })
    if(!user){
        res.json({
            message : "user is not axist",
            isSuccess : false
        })
    }

    const adminset = await prisma.user.update({
        where:{
            id : req.user?.userId
        },
        data:{
            isAdmin : !user?.isAdmin,
            role  
        }
    })
    res.json({
        adminset,
        isSuccess : true
    })
    
}

