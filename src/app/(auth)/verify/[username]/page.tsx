'use client';

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const VerifyAccount = () => {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username,
        code: data.code
      })

      toast.success(response.data.message);
      router.replace("/sign-in")
    } catch (error) {
      console.error("Error in verification: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message
      toast.error("Verification failed", {
        description: errorMessage || "An error occurred during verification"
      })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 text-white relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md p-8 space-y-8 bg-slate-900/50 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-2">
            Verify Your Account
          </h1>
          <p className="text-slate-400">
            Enter the 6-digit code sent to your email to activate your account.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Verification Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00000" 
                      {...field} 
                      className="bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20 text-center text-2xl tracking-[0.5em] font-bold py-6 transition-all"
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-6 transition-all duration-300 shadow-lg shadow-indigo-500/20"
            >
              Verify Account
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount;