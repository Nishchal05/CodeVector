import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(request: NextRequest) {
   try{
      const id=request.nextUrl.searchParams.get("id");
      let product:any=null;
      if(id){
         product =await prisma.product.findUnique({
            where:{
               id:Number(id)
            }
         });
         return NextResponse.json({
            product,
         })
      }
      const next= request.nextUrl.searchParams.get("next");
      const prev= request.nextUrl.searchParams.get("prev");
      const category=request.nextUrl.searchParams.get("category");
      const where : any={};
      
      if(category && category!=='all'){
         where.category=category;
      }else{
         
         where.category={"in":["MensClothes","WomensClothes","KidsClothes","Shoes"]}
         
      }
      let orderByDir: "asc" | "desc" = "desc";
      let isPrev = false;

      if(prev!==null && Number(prev)!==0){
         where.id={gt:Number(prev)};
         orderByDir = "asc";
         isPrev = true;
      }
      else if (next !== null && Number(next) !== 0) {
         where.id = {
           lt: Number(next),
         };
       }
       product = await prisma.product.findMany({
         where,
         orderBy:{
            id: orderByDir
         },
         take:20,
      })

      if (isPrev) {
         product.reverse();
      }
      return NextResponse.json({
         product,
         firstitem: product.length > 0 ? product[0].id : null,
         lastitem: product.length > 0 ? product[product.length-1].id : null,

      })
      
   }catch(error){
      console.log(error)
      return NextResponse.json({ message: "Internal server error" }, { status: 500 })
   }
}
export async function POST(request:NextRequest){
   try{
      const product= await request.json();
      const name=product.name;
      const category=product.category;
      const pricing = product.pricing;
      if(!name||!category||!pricing){
         console.log(product);
         return NextResponse.json({
            message:"Missing item details",
         },{
            status:401
         })
      }
      const newproduct=await prisma.product.create({
         data:{
            name,
            category,
            pricing
         }
      });
      
      return newproduct ? NextResponse.json({
         message:"Product Listed Successfully",
      },{
         status:201
      }):
      NextResponse.json({
         message:"Product Listed Failed",
      },
      {
         status:501
      })
   }catch(error){
      NextResponse.json({
         message:"Product Listed Failed",
      },
      {
         status:501
      })
   };
}

export async function PUT(request:NextRequest) {
   try{
      const productdetail=await request.json();
      const where:any={};
      const update:any={};
      if(productdetail.id){
         where.id=Number(productdetail.id);
      }
      else{
         
            return NextResponse.json(
              { message: "Product id is required" },
              { status: 400 }
            );
          
      }
      if(productdetail.name){
         update.name=productdetail.name;
      }
      if(productdetail.category){
         update.category=productdetail.category;
      }
      if(productdetail.pricing){
         update.pricing=productdetail.pricing;
      }

      const updateproduct = await prisma.product.update({
            where,
            data:update
      })
      return NextResponse.json({
         message: "Product updated successfully",
         product: updateproduct,
       });
   }catch(error){
      return NextResponse.json({
         message:`error while running ${error}`
      },{
         status:500
      })
   }
}