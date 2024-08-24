import { Field, PublicKey, Struct,UInt64, Provable, CircuitString} from "o1js";
import {
    RuntimeModule,
    runtimeMethod,
    runtimeModule,
    state,
    
  } from "@proto-kit/module";

import  { State,StateMap, assert} from "@proto-kit/protocol";
import { inject } from "tsyringe";
import { Balances } from "./balances";
import { Chating } from "./chat";
import { TokenId, Balance } from "@proto-kit/library";


@runtimeModule()
export class Balanchat extends Chating{
    public constructor(@inject("Balances") public balances: Balances) {super(); }

    @runtimeMethod()
    async sendMoney(content: CircuitString, to: PublicKey, amount: Balance) {
        await this.balances.transfer(TokenId.from(0), this.transaction.sender.value, to, amount);
    }

}