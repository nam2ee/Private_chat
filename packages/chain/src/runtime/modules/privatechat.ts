import { Field, PublicKey, Struct,UInt64, Provable, CircuitString} from "o1js";
import {
    RuntimeModule,
    runtimeMethod,
    runtimeModule,
    state,
    
  } from "@proto-kit/module";

import  { State,StateMap, assert} from "@proto-kit/protocol";


export class Message extends Struct({
  createdAt: UInt64,
  from: PublicKey,
  to: PublicKey,
  content: CircuitString,
}) {}

   
@runtimeModule()
export class Private_chat extends RuntimeModule<Record<string, never>> {
    // public constructor(@inject("Balances") public balances: Balances) {super(); }
    // Record<string, never> is an empty object type.
    // there is no need to the type of the config object.   
    @state() private index = State.from<UInt64>(UInt64);

    @state() private message_list = StateMap.from( UInt64, Message); // index to message

    @runtimeMethod()
    public async sendMessage(content: CircuitString, to: PublicKey) {
        const message = new Message({
            createdAt: this.network.block.height,
            from: to,
            to: to,
            content,
          }); // create a new message

          const index_p =  (await this.index.get()).orElse(UInt64.from(1)); // get the current index from the state

          await this.index.set(index_p.add(UInt64.from(1))) // increase the counter

          assert(index_p.lessThanOrEqual(UInt64.from(1000)), "Message list is full"); // check if the message list is full

          await this.message_list.set(index_p.add(UInt64.from(1)), message); // set the message

    }

    public async getMessage(index: UInt64) {
        const dummy = new Message({
            createdAt: UInt64.from(0),
            from: PublicKey.fromBase58("B62qn4SYiBmB9Ly8aHN3asfzdDrKhCNekiisNc8D5VBNwtJ6a8Fqy8P"),
            to: PublicKey.fromBase58("B62qn4SYiBmB9Ly8aHN3asfzdDrKhCNekiisNc8D5VBNwtJ6a8Fqy8P"),
            content: CircuitString.fromString("hello"),
          });
        const message = (await this.message_list.get(index)).orElse(dummy);
        return message;
    }

    @runtimeMethod()
    async increaseCounter() {
        const index = (await this.index.get()).orElse(UInt64.from(0)); // get the current index from the state
        await this.index.set(index.add(UInt64.from(1))); // increase the index by 1
    }

    public async getCounter()  {
        const index_p =  await this.index.get();
        let index = index_p.orElse(UInt64.from(1));
        return index;
    }


}
