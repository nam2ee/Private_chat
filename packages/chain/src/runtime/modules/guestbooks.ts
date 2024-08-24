import { Field, PublicKey, Struct,UInt64, Provable} from "o1js";
import {
    RuntimeModule,
    runtimeMethod,
    runtimeModule,
    state,
    
  } from "@proto-kit/module";

import  { State,StateMap, assert } from "@proto-kit/protocol";

 



   
@runtimeModule()
export class GuestBook extends RuntimeModule<Record<string, never>> { 
    // Record<string, never> is an empty object type.
    // there is no need to the type of the config object.    
    @state() public counter = State.from(UInt64);

    @state() public cash = StateMap.from(PublicKey, UInt64);

    @runtimeMethod()
    public async checkIn(rating: UInt64) {
        await this.counter.set(rating);
    }

    @runtimeMethod()
    public async givecash(amount: UInt64, to: PublicKey) {

        await this.cash.set(to, amount);
    }

    public async getCounter() {
        return await this.counter.get();
    }


}
