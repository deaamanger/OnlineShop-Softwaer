import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST ( 
    req : Request,
     { params }: { params: {storeId: string}}
     ) {
        try {
          const { userId } = auth();
          const body = await req.json();
          const {name,billboardId , imageUrl } = body;

           if(!userId) {
             return new NextResponse("Unauthenticated", {status: 401});
           }

           if(!name) {
            return new NextResponse("Name is required", { status: 400 });
           }

           if(!billboardId) {
            return new NextResponse("Billboard-ID is required", { status: 400 });
           }
           if(!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
           }
           
           if(!params.storeId){
            return new NextResponse("Store-ID is required", { status: 400 });
           }
            
           const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
           })
            
           if(!storeByUserId){
              return new NextResponse("unauthorized", {status: 403});
           }

           const category = await prismadb.category.create({
            data: {
              name ,
              imageUrl,
              billboardId,
              storeId: params.storeId
            }
           });
           
           return NextResponse.json(category);

        } catch (error) {
        console.log('[GATEGORY_POST]', error);
        return new NextResponse("Interal error", { status: 500});
        }
    
}

export async function GET ( 
    req : Request,
     { params }: { params: {storeId: string}}
     ) {
        try {
            
           if(!params.storeId){
            return new NextResponse("Store ID is required", { status: 400 });
           }

           const categories = await prismadb.category.findMany({
            where: {       
              storeId: params.storeId
            }
           });
           
           return NextResponse.json(categories);

        } catch (error) {
        console.log('[GATEGORY_GET]', error);
        return new NextResponse("Interal error", { status: 500});
        }
    
}

