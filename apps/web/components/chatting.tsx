"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";


export interface ChattingProps {
  wallet?: string;
  loading: boolean;
  onConnectWallet: () => void;
  onChatting: (message: string) => void;
}

export function Chatting({
    wallet,
    onConnectWallet,
    onChatting,
    loading,
  }: ChattingProps) {
    const form = useForm<{ message: string }>({
      defaultValues: { message: "" },
    });
  
    return (
            <Card className="w-full p-4">
              <div className="mb-2">
                <h2 className="text-xl font-bold">Send</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Send a message to your friends!
                </p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => {
                  if (wallet) {
                    onChatting(data.message); // 메시지 전송
                  } else {
                    onConnectWallet();
                  }
                })}>
                  <div className="pt-3">
                    <FormField
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={wallet ? "Type your message..." : "Please connect a wallet first"}
                              disabled={!wallet}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
          
                  <Button
                    size={"lg"}
                    type="submit"
                    className="mt-6 w-full"
                    loading={loading}
                    disabled={!wallet || loading}
                  >
                    {wallet ? "Send 💦" : "Connect wallet"}
                  </Button>
                </form>
              </Form>
            </Card>
          );
          
  }
  