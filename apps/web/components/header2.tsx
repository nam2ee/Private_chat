import { Button } from "@/components/ui/button";
import protokit from "@/public/protokit-zinc.svg";
import Image from "next/image";
// @ts-ignore
import truncateMiddle from "truncate-middle";
import { Skeleton } from "@/components/ui/skeleton";
import { Chain } from "./chain";
import { Separator } from "./ui/separator";
import { Msg } from "@/lib/stores/chat";

export interface HeaderProps2 {
  loading: boolean;
  wallet?: string;
  onConnectWallet: () => void;
  messages?: Msg[];
  messageLoading: boolean;
  blockHeight?: string;
}

export default function Header2({
  loading,
  wallet,
  onConnectWallet,
  messages,
  messageLoading,
  blockHeight,
}: HeaderProps2) {
  return (
    <div className="flex items-center justify-between border-b p-2 shadow-sm">
      <div className="container flex">
        <div className="flex basis-6/12 items-center justify-start">
          <Image className="h-8 w-8" src={protokit} alt={"Protokit logo"} />
          <Separator className="mx-4 h-8" orientation={"vertical"} />
          <div className="flex grow">
            <Chain height={blockHeight} />
          </div>
        </div>
        <div className="flex basis-6/12 flex-row items-center justify-end">
          {/* messages */}
          {wallet && (
            <div className="mr-4 flex shrink flex-col items-end justify-center">
              <div>
                <p className="text-xs">Your Received Messages </p>
              </div>
              <div className="w-32 pt-0.5 text-right">
                {messageLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : (
                  <p className="text-xs font-bold">{messages?.length} Messages</p>
                )}
              </div>
              {/* 최근 메시지 표시 (옵션) */}
              {messages && messages.length > 0 && (
                <div className="mt-1 text-xs">
                  <p>Latest: {messages[messages.length-1].content }</p>
                
                </div>
              )}
            </div>
          )}
          {/* connect wallet */}
          <Button loading={loading} className="w-44" onClick={onConnectWallet}>
            <div>
              {wallet ? truncateMiddle(wallet, 7, 7, "...") : "Connect wallet"}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
