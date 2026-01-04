'use client'

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X, Calendar } from "lucide-react"
import { Message } from "@/model/User"
import { toast } from "sonner"
import axios from "axios"
import dayjs from 'dayjs'
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
   message: Message;
   onMessageDelete: (messageId: string) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
   const handleDeleteConfirm = async () => {
      const messageId: string = message._id.toString();
      try {
         const response = await axios.delete<ApiResponse>(`/api/delete-message/${messageId}`)
         toast.success(response.data.message)
         onMessageDelete(messageId);
      } catch (error) {
         toast.error("Failed to delete message")
      }
   }

  return (
   <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-md hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden">
      <CardHeader className="p-6">
      <div className="flex justify-between items-start gap-4">
         <div className="space-y-3">
            <CardTitle className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed">
            {message.content}
            </CardTitle>
            
            <div className="flex items-center text-xs font-medium text-slate-500 gap-1.5 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-indigo-400/70" />
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
         </div>

         <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button 
               variant="ghost" 
               size="icon" 
               className="h-9 w-9 text-slate-500 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all shrink-0"
            >
               <X className="w-5 h-5" />
            </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent className="bg-slate-950 border border-slate-800 text-white">
            <AlertDialogHeader>
               <AlertDialogTitle className="text-xl font-bold">Delete Message?</AlertDialogTitle>
               <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. This will permanently remove this anonymous feedback from your dashboard.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className="bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white">
                  Cancel
               </AlertDialogCancel>
               <AlertDialogAction 
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-500 text-white transition-colors"
               >
                  Delete
               </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
      </CardHeader>
      
   <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
   </Card>
  )
}

export default MessageCard