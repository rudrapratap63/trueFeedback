import { auth } from "../auth/[...nextauth]/route"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import mongoose from "mongoose";
import { User } from "next-auth"

export async function GET(request: Request){
   await dbConnect();

   const session = await auth();
   const user: User = session?.user as User;

   if(!session || !session.user){
      return Response.json(
         {
            success: false,
            message: "Not Authenticated"
         },
         {status: 401}
      )
   }

   const userId = new mongoose.Types.ObjectId(user._id);
   try {
      const dbUser = await UserModel.aggregate([
         {$match: {_id: userId}},
         {$unwind: {path: '$messages', preserveNullAndEmptyArrays: true}},
         {$sort: {'messages.createdAt': -1}},
         {$group: {_id: '$_id', messages: {$push: '$messages'}}}
      ])
      if(!dbUser || dbUser.length === 0){
         return Response.json(
            {
               success: false,
               message: "User not found"
            },
            {status: 401}
         )
      }

      return Response.json(
         {
            success: true,
            messages: dbUser[0].messages
         },
         {status: 200}
      )
   } catch (error) {
      console.error("Error in getting messages", error);
      return Response.json(
         {
            success: false,
            message: "Error in getting messages"
         },
         {status: 500}
      )
   }
}