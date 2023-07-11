import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { customerUserRequest } from "../helpers/security/jwt";
const prisma = new PrismaClient();



export const cart = async(req:customerUserRequest,res:Response)=>{

    try {
        
        const newcart = await prisma.cart.create({
            data :{
                userId : req.user?.userId!
            }
        })
        
        res.json({
            isSuccess : true,
            result : {...newcart}
        })

    } catch (error) {
        res.status(500).json(error)
    }

}

//get all carts

export const getall = async(req:Request,res:Response)=>{

    try {
        
        const all = await prisma.cart.findMany({
            include :{
                User:{
                    select :{
                        firstName : true,
                        lastName : true,
                        email : true
                    }
                },cartItem : {
                    select : {
                        productId : true,
                        cartId : true,
                        product : {
                            select :{
                                productName : true,
                                productPrice : true,
                                Desc : true,
                                
                            }
                        }
                        
                    },
                    
                },
                
                
            },
            
        })

        res.json({
            isSuccess : true,
            result : [...all]
        })

    } catch (error) {
        res.json(error)
    }

}

// AddtoCart

export const AddtoCart = async(req:customerUserRequest,res:Response)=>{
    try {
        
      var userCart = await prisma.cart.findFirst({
        where :{
            userId : req.user?.userId
        }
      })
      if(!userCart){
        userCart = await prisma.cart.create({
            data :{
                userId : req.user?.userId!
            }
        }) 
      }
      const findpro = await prisma.product.findFirst({
          where :{
           id : req.body.productId
          }
      })

      if(!findpro){
        return res.json({
            message : `Product ${req.body.productId} is not axist`,
            isSuccess : false
        })
      }


      // setCartItem

      const serCart = await prisma.cartItem.create({
        data :{
            cartId : userCart.id,
            productId : req.body.productId,
        }
      })

      res.json({
        isSuccess : true,
        result:{...serCart}
      })


    } catch (error) {
        console.log(error)
        res.status(5000).json(error)
    }

}