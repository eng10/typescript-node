import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import { Request,Response } from "express";
import { customerUserRequest } from "../helpers/security/jwt";

// create new product

interface product{
    productName: string,
    productPrice : number,
    Desc : string,
    shortDesc : string
    cateId : number
    stock : number

}


// gell all product 

export const getAll = async (req: customerUserRequest, res: Response)=>{
  const products = await prisma.product.findMany({
    where: {
       isDeleted : false
    },
    include: {
        User:{
            select: {
                id: true,
                firstName:true,
                lastName: true,
                createdAt : true
            }
        }
    }
  })

  res.json({
    message : "Success",
    result:[...products],
  })
  console.log(products)
} 
export const allpublished = async (req: customerUserRequest, res: Response)=>{
  const products = await prisma.product.findMany({
    where: {
       isDeleted : false,
       isPublish : true
    },
    include: {
        User:{
            select: {
                id: true,
                firstName:true,
                lastName: true,
                createdAt : true
            }
        }
    }
  })

  res.json({
    message : "Success",
    result:[...products],
  })
  console.log(products)
} 

// ======================================================================================================================

// Get one User 


export const oneUser = async (req: customerUserRequest, res:Response)=>{
  try {
    const {id} = req.params

  const item = await prisma.product.findFirst({
    where:{
      id: +id,
      isDeleted : false
    },
    include :{
      User:{
        select:{
          firstName: true,
          lastName: true,
          createdAt : true,
          updatedAt : true,
          email : true
        }
      }
    }
    
  })

  if(!item){
  return  res.json({
      message : "your Product is not on the databse",
      isSuccess : false
    })
  }
  
  res.json({
    isSucess : true,
    item
  })

  } catch (error) {
    res.json({
      error
    })
  }
}

//============== create=product ==========================//
//============== create=product ==========================//



export const createPro = async(req:customerUserRequest,res:Response)=>{
  
   try {

    if(!req.user?.isAdmin){
      return res.json({
        isSuccess : false,
        message : "Uh No, U not allowed!!!!!!"
      })
    }

    const  {productName,productPrice,Desc,shortDesc,cateId,stock} = req.body as product
    
    if(!productName||!productPrice||!Desc||!shortDesc||!cateId||!stock){
     return res.json({
        message : "please complete data",
        isSuccess : false
      })
    }
    
    //newProduct

    const newpro = await prisma.product.create({

      

      data: {
        productName,
        userId: req.user?.userId!,
        Desc,
        productPrice,
        shortDesc,
        cateId,
        stock
      },
      include :{
        User:{
          select : {
            id : true,
            firstName : true,
            lastName: true,
            isAdmin: true
          }
        }
      }
    }); 

res.json({
  isSuccess : true,
  result : {...newpro}
})
   } catch (error) {
    res.json(error)
   }

}


// update Product 


export const updatePro = async (req:Request , res:Response)=>{
  try {
    const {id} = req.params
  const {productName, productPrice, Desc,shortDesc,stock} = req.body as product

  if(!productName ||productPrice <= 1 ||!Desc ||!shortDesc ||!stock){
    return res.json({
      "message" : "Your data is missing",
 
    })
   
  }

   const item = prisma.product.findFirst({
    where:{
      id : +id
    },
    include :{
      User:{
        select:{
          firstName:true,
          lastName:true,
          email : true
        }
      }
    }
  })

  if(!item)
  
  
  return res.json({
    message: "Your Product is not the database",
  }) 
  

   const update = await prisma.product.update({
    data:{
      productName,
      productPrice,
      Desc,
      shortDesc,
      stock
    },
    where:{
      id : +id
    }
   })

   res.json({
    maessage : "Success",
    update
   })
  
  } catch (error) {
    res.json({
      error
    })
  }
}


// delete product 



export const removePro = async (req: Request, res:Response)=>{
  const {id} = req.params
  const item = await prisma.product.findFirst({
    where:{
      id : +id,
      isDeleted : false
    }
     
  })
  
  if (!item)
  return res.json({

    message : "Product is not created",
    isSuccess : false,
    
  })

  await prisma.product.update({
    where:{
      id : item.id
    },
    data:{
      isDeleted : true
    }
  })

  res.json({
    message  : "deleted Successfull",
    isSuccess : true,
    item
  })

}

 export const Restore = async (req:Request,res:Response)=>{
  const {id} = req.params

  const restoring = await prisma.product.findFirst({
    where:{
      id: +id,
      isDeleted : true
    }
  })

  if(!restoring)
  return res.json({
     isSuccess : false,
     message : "your ProductId is not stay in database"
  })
            

  const item = await prisma.product.update({
    where:{
      id :+id,
    },
    data:{
      isDeleted : false
    }
  })



  res.json({
    isSuccess : true,
    item
  })

}

//==================================== Deleteing ===============================//


export const deleting = async (req:Request, res:Response)=>{
const  {id} = req.params

const item = await prisma.product.findFirst({
  where:{
    id:+id,
    isDeleted : true
  },
 include :{
  User:{
    select:{
      firstName : true,
      createdAt : true,
      id: true
    }
  }
 }
  
})

if(!item)

return res.json({
  isSuccess : false,
  message : "Your product is not Axist"
})

const del = await prisma.product.delete({
  where:{
    id:+id
  },
})

res.json({
  del,
  isSuccess : true,
  message : "your product is Deleted"
})


} 

// making counter Product

export const counter = async (req:Request,res:Response)=>{
  const procounter = await prisma.product.aggregate({
    _count : true
  })
  res.json({
    procounter
  })
}

//all restoring

export const allrestoring = async(req:Request,res:Response)=>{
  const allpro = await prisma.product.findMany({
    where : {
      isDeleted : true
    }
  })
   
  res.json({
    allpro
  })
}


//Published

export const publish = async(req:Request,res:Response)=>{
  try {
    const {ProductId} = req.params


    const checkid = await prisma.product.findFirst({
      where :{
        id : +ProductId
      }
    })
 
    if(!checkid){
      return res.json({
        message : "ProductId is not axist",
        isSuccess : false
      })
    }

    const Published = await prisma.product.update({
      where :{
       id : +ProductId
      },
      data :{
        isPublish : true
      }
    })
  
    res.json({
      isSuccess : true,
      result : {...Published}
    })
  } catch (error) {
    res.json(error)
  }

}