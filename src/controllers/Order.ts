import { PrismaClient } from "@prisma/client";
import { customerUserRequest } from "../helpers/security/jwt";
import { Response } from "express";
const prisma = new PrismaClient()




export const    createorder = async(req:customerUserRequest,res:Response)=>{
    try {
        const { cartId } = req.params;

        const findCart = await prisma.cart.findFirst({
          where: {
            id: +cartId,
          },
          include: {
            cartItem: {
              select: {
                product: true,
              },
            },
          },
        });
    
        if (!findCart)
          return res.json({
            isSuccess: false,
            message: 'Cart not found',
          });
    
          const total = findCart.cartItem.reduce(
              (prev, current) =>
              prev + parseInt(current.product.productPrice.toString()),
              0
        );
    
        const newOrder = await prisma.order.create({
          data: {
              items: JSON.stringify(findCart.cartItem!),
              totalPrice: total,
              cartId: findCart.id,
              userId : req.user?.userId!
          },
          include : {
            user : {
                select : {
                    firstName : true,
                    lastName : true,
                    
                }
            }
          }
        });

          //  await prisma.cart.delete({
          //     where: {
          //       id: findCart.id,
          //     },
          //   });
        res.json({
          isSuccess: true,
          message: 'Added to the cart.',
          result: { ...newOrder },
          
        });
        // console.log(newOrder)
        
        
    } catch (error) {
        error
    }
}

