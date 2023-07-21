import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { customerUserRequest } from "../helpers/security/jwt";
const prisma = new PrismaClient();



//getone
// export const getone = async(req:customerUserRequest,res:Response)=>{

//     try {
//         const one = await prisma.cart.findMany({
//             where : {
//                id: req.user?.userId!
//             }
//         })
//         res.json({
//             result : [...one],
//             isSuccess : true
//         })
//     } catch (error) {
//         error
//     }
// }
//get all carts

export const getall = async(req:customerUserRequest,res:Response)=>{

    try {
        
        const all = await prisma.cart.findMany({
            where : {
              userId : req.user?.userId
            },
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
                                User : {
                                    select : {
                                        lastName: true,
                                        firstName : true,
                                        id : true
                                    }
                                }
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
        
      let userCart = await prisma.cart.findFirst({
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

      const setCart = await prisma.cartItem.create({
        data :{
            cartId : userCart.id,
            productId : req.body.productId,
        }
      })
      res.json({
        isSuccess : true,
        result:{...setCart}
      })
    } catch (error) {
        console.log(error)
        res.status(5000).json(error)
    }
}