import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

interface categorycreated {
    catname: string
    catdesc:string
    catimage: string
}

export const categorycreate = async(req:Request,res:Response)=>{
  try {
    const categoryInfo = req.body as categorycreated;
    const newCategory = await prisma.category.create({
      data: {
        catname: categoryInfo.catname,
        catimage: categoryInfo.catimage,
        catdesc: categoryInfo.catdesc,
      },
    });

    res.json({
      isSuccess: true,
      result: { ...newCategory },
    });
  } catch (error) {
    console.log(error);
    res.json({
      isSuccess: false,
      message: 'Failed to create new category',
    });
  }
}