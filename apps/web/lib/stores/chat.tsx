import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Client, useClientStore } from "./client";
import { useWalletStore } from "./wallet";
import { CircuitString, PublicKey, UInt64 ,Struct, Provable} from "o1js";
import { useCallback, useEffect } from "react";
import { useChainStore } from "./chain";
import { PendingTransaction, UnsignedTransaction } from "@proto-kit/sequencer";
import {Balance, BalancesKey,TokenId} from "@proto-kit/library";
import { stat } from "fs";
import { tokenId } from "./balances";


export class Message extends Struct({
    createdAt: UInt64,
    from: PublicKey,
    to: PublicKey,
    content: CircuitString,
  }) {}

export type Msg = {
    createdAt: string,
    from: string,
    to: string,
    content: string,
}

export interface MessageState {
    loading: boolean;
    messages: {
      // address - balance
      [address: string]: Msg[];  // 주소를 키로, Msg 배열을 값으로 가지는 객체

    };
    loadMessage: (client: Client, address: string) => Promise<void>;
    SendMessage: (client: Client, content: string, from: string, to: string) => Promise<PendingTransaction>;
  }

  function isPendingTransaction(
    transaction: PendingTransaction | UnsignedTransaction | undefined,
  ): asserts transaction is PendingTransaction {
    if (!(transaction instanceof PendingTransaction))
      throw new Error("Transaction is not a PendingTransaction");
  }


export const useMessageStore = create< MessageState, [["zustand/immer", never]] >(
    immer((set) => ({
      loading: Boolean(false),
      messages: {},
      async loadMessage(client: Client, address: string) {
        set((state) => {
          state.loading = true;
        });
        
        const from = PublicKey.fromBase58(address);

        const chating = client.runtime.resolve("Chating");

        let index= await client.query.runtime.Chating.index.get();

        //let tokenId = TokenId.from(0);
        //const key = BalancesKey.from(tokenId, PublicKey.fromBase58("B62qn4SYiBmB9Ly8aHN3asfzdDrKhCNekiisNc8D5VBNwtJ6a8Fqy8P"));
        //const balance = await client.query.runtime.Chating.balances.get(key);
    
        
        if(index === undefined) { 
            index = UInt64.from(0);
        }
        console.log(index.toBigInt());
        
        // 1부터 index까지의 메시지를 가져온다.
        let message_list = [];
        for (let i = 1; i <= index.toBigInt(); i++) {
          const message = await client.query.runtime.Chating.message_list.get(UInt64.from(i));

            if(message === undefined) {
                continue;
            }

          message_list.push(message);
        } 




        let received_messages:Msg[] = [];

        message_list.forEach((message) => {
            let from_address = message.from.toBase58();
            let createdAt = message.createdAt.toString();
            let to = message.to.toBase58();
            let content = message.content.toString();
            let msg:Msg = {createdAt, from: from_address, to, content};
            if(address == from_address) {received_messages.push(msg) } 
        })

      set((state) => {
        state.loading = false;
        state.messages[address] = received_messages;
        }) 
    },

      async SendMessage(client: Client, content:string, from : string,  to: string,) {

        console.log("from" , from);
        console.log("to", to);

        const chating = client.runtime.resolve("Chating");
        const sender = PublicKey.fromBase58(from);
        const receiver = PublicKey.fromBase58(to);
  
        const tx = await client.transaction(sender, async () => {
            await chating.sendMessage(CircuitString.fromString(content), receiver);
        });
  
        await tx.sign();
        await tx.send();
        isPendingTransaction(tx.transaction);

        
        return tx.transaction;
      }, 

    }))
);


export const useLoadMessage = () => {
  const client = useClientStore();
  const chain = useChainStore();
  const wallet = useWalletStore();
  const chating = useMessageStore();

  useEffect(() => {
    if (!client.client || !wallet.wallet) return;

    chating.loadMessage(client.client, wallet.wallet);

    }, [client.client, chain.block?.height, wallet.wallet]);
};

export const useSendMessage = () =>  {
  const client = useClientStore();
  const chating = useMessageStore();
  const wallet = useWalletStore();

  return useCallback(async (message: string) => {
    if (!client.client || !wallet.wallet) return;

    const pendingTransaction = await chating.SendMessage(
        client.client,
        message,
        wallet.wallet, // from
        wallet.wallet, // to
    );

    wallet.addPendingTransaction(pendingTransaction);
  }, [client.client, wallet.wallet]);

  
};
