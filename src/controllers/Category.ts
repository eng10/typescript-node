import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { customerUserRequest } from "../helpers/security/jwt";
const prisma = new PrismaClient();

interface categorycreated {
    catname: string
    catdesc:string
    catimage: string
}

export const categorycreate = async(req:customerUserRequest,res:Response)=>{
  try {

    if(!req.user?.isAdmin){
      return res.status(405).json({
        message : "Uh No u not Allowed!!!",
        isSuccess : false
      })
    }
  

    //check name
    const categoryInfo = req.body as categorycreated;

    const checkname = await prisma.category.findFirst({
      where :{
        catname: categoryInfo.catname,
      }
    })

    if(checkname){
      return res.json({
        message : "name is already taken",
        isSuccess :false
      })
    }


    const newCategory = await prisma.category.create({
      data: {
        catname: categoryInfo.catname,
        catimage: categoryInfo.catimage,
        catdesc: categoryInfo.catdesc
      },
    });

    res.json({
      isSuccess: true,
      result: { ...newCategory },
    });
  } catch (error) {
   console.log(error)
    res.status(500).json({
      isSuccess: false,
      message: 'Failed to create new category',
    });
  }
}


//allcategory

export const allcategory = async(req:Request,res:Response)=>{
  const all = await prisma.category.findMany()
  res.status(200).json({
    resul : [...all],
    isSuccess : true
  })
}