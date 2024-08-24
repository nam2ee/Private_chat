import { Balance, VanillaRuntimeModules } from "@proto-kit/library";
import { RuntimeModule } from "@proto-kit/module";
import { ModulesConfig } from "@proto-kit/common";

import { Balances } from "./modules/balances";
import { GuestBook } from "./modules/guestbooks";
import { Chating } from "./modules/chat";

export const modules = {
  Balances,
  GuestBook,
  Chating

};

export const config: ModulesConfig<typeof modules> = {
  Balances: {
    totalSupply: Balance.from(10_000),
  },
  GuestBook: {},
  Chating: {},
};

export default {
  modules,
  config,
};
