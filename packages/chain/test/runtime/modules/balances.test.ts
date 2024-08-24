import { TestingAppChain } from "@proto-kit/sdk";
import { CircuitString, method, PrivateKey, UInt64 as U64} from "o1js";
import { Balances } from "../../../src/runtime/modules/balances";
import { log } from "@proto-kit/common";
import { BalancesKey, TokenId , UInt64} from "@proto-kit/library";
import {GuestBook} from "../../../src/runtime/modules/guestbooks";
import {Chating} from "../../../src/runtime/modules/chat";
import { console_log } from "o1js/dist/node/bindings/compiled/node_bindings/plonk_wasm.cjs";

log.setLevel("ERROR");

describe("balances", () => {
  it("should demonstrate how balances work", async () => {
    const appChain = TestingAppChain.fromRuntime({
      Balances,
      GuestBook,
      Chating,
    });

    appChain.configurePartial({
      Runtime: {
        Balances: {
          totalSupply: UInt64.from(10_000),
        },
        GuestBook: {},
        Chating: {},
      },
    });

    await appChain.start();

    const alicePrivateKey = PrivateKey.random();
    const alice = alicePrivateKey.toPublicKey();
    //const tokenId = TokenId.from(0);
    const BobPrivateKey = PrivateKey.random();
    const Bob = BobPrivateKey.toPublicKey();

    appChain.setSigner(alicePrivateKey);

    //const balances = appChain.runtime.resolve("Balances");
    const chating = appChain.runtime.resolve("Chating");

    /*

    const tx1 = await appChain.transaction(alice, async () => {
      await balances.addBalance(tokenId, alice, UInt64.from(1000));
    });

  
    await tx1.sign();
    await tx1.send();
    */

    const tx2 = await appChain.transaction(alice, async () => { 
      await chating.sendMessage(CircuitString.fromString("I'm here!"), Bob);
      console.log("Message sent");
    });

    await tx2.sign();
    console.log("tx2 signed");
    await tx2.send();
    console.log("tx2 sent");

    const block = await appChain.produceBlock();


    //const key = new BalancesKey({ tokenId, address: alice });
    //const balance = await appChain.query.runtime.Balances.balances.get(key);
    const message = await appChain.query.runtime.Chating.message_list.get(U64.from(1));

    console.log(message?.content.toString());
    //console.log(balance);

    expect(block?.transactions[0].status.toBoolean()).toBe(true);
    //expect(balance?.toBigInt()).toBe(1000n);
    //expect(checkIn?.rating.toBigInt()).toBe(5n);
    expect(message?.content.toString()).toBe("I'm here!");
  }, 1_000_000);
});
