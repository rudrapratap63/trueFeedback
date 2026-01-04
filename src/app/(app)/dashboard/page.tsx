'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Copy, Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));
  }

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages as boolean)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to fetch settings"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Refreshed Messages", { description: "Showing latest messages" })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to fetch messages"
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage])

  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true)
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message || "Failed to update settings"
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
      </div>
    )
  }

  const { username } = session?.user as User;
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL Copied", { description: "Link copied to clipboard!" })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 my-8 mx-4 md:mx-8 lg:mx-auto p-8 bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-2xl w-full max-w-6xl shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          User Dashboard
        </h1>

        <div className="mb-8 p-6 bg-slate-950/50 border border-slate-800 rounded-xl space-y-4">
          <h2 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Your Unique Link</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="grow bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-300 text-sm focus:outline-none"
            />
            <Button 
              onClick={copyToClipboard}
              className="bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center space-x-3 bg-slate-950/40 p-4 rounded-full border border-slate-800">
            <Switch
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-indigo-600"
            />
            <span className="text-sm font-medium text-slate-300">
              Accept Messages: {acceptMessages ? 
                <span className="text-green-400">On</span> : 
                <span className="text-red-400">Off</span>}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white transition-all rounded-full h-12 w-12"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCcw className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Separator className="bg-slate-800 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-500 italic">No messages to display yet. Share your link to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard