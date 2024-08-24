import Header2 from "@/components/header2";
import { Toaster } from "@/components/ui/toaster";
import { useMessageStore, useLoadMessage } from "@/lib/stores/chat";
import { useChainStore, usePollBlockHeight } from "@/lib/stores/chain";
import { useClientStore } from "@/lib/stores/client";
import { useNotifyTransactions, useWalletStore } from "@/lib/stores/wallet";
import { ReactNode, useEffect, useMemo } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {
  const wallet = useWalletStore();
  const client = useClientStore();
  const chain = useChainStore();
  const messages = useMessageStore();

  usePollBlockHeight();
  useLoadMessage();
  useNotifyTransactions();

  useEffect(() => {
    client.start();
  }, []);

  useEffect(() => {
    wallet.initializeWallet();
    wallet.observeWalletChange();
  }, []);

  const loading = useMemo(
    () => client.loading || messages.loading,
    [client.loading, messages.loading],
  );

  return (
    <>
      <Header2
        loading={client.loading}
        onConnectWallet={wallet.connectWallet}
        messages={messages.messages[wallet.wallet ?? ""]}
        messageLoading={loading}
        wallet={wallet.wallet}
        blockHeight={chain.block?.height ?? "-"}
      />
      {children}
      <Toaster />
    </>
  );
}

