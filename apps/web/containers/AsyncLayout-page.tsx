"use client";
import { Chatting } from "@/components/chatting";
import { useSendMessage } from "@/lib/stores/chat";
import { useWalletStore } from "@/lib/stores/wallet";

export default function Home2() {
  const wallet = useWalletStore();
  const sendMessage = useSendMessage();


  return (
    <div className="mx-auto -mt-32 h-full pt-16">
      <div className="flex h-full w-full items-center justify-center pt-16">
        <div className="flex basis-4/12 flex-col items-center justify-center 2xl:basis-3/12">
          <Chatting
            wallet={wallet.wallet}
            onConnectWallet={wallet.connectWallet}
            onChatting={sendMessage}
            loading={false}
          />
        </div>
      </div>
    </div>
  );
}
