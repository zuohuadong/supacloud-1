# Changelog

## [0.9.0](https://github.com/zuohuadong/supacloud-1/compare/contracts-v0.8.0...contracts-v0.9.0) (2026-10-31)


### ⚠ BREAKING CHANGES

* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **commands:** persist definitive external rejections ([#1496](https://github.com/zuohuadong/supacloud-1/issues/1496)) ([5c1b816](https://github.com/zuohuadong/supacloud-1/commit/5c1b816e138b7d0415224076621a937142965ea3))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* **contracts:** add validated identity, app error and recovery contracts ([#1366](https://github.com/zuohuadong/supacloud-1/issues/1366)) ([2811d97](https://github.com/zuohuadong/supacloud-1/commit/2811d9711431fd5e9b495c67728441883908af4f))
* **elysia:** add read-only command preview ([#1302](https://github.com/zuohuadong/supacloud-1/issues/1302)) ([995bcd4](https://github.com/zuohuadong/supacloud-1/commit/995bcd43ac3639465eab476deefadd0f37867427))
* freeze authored type-safety merge gate ([25e07ea](https://github.com/zuohuadong/supacloud-1/commit/25e07ea1de16cc01a24ed6f001b9bdc729b5ee5e))
* **js:** publish SDK and Contracts as dual MJS and CJS ([#1585](https://github.com/zuohuadong/supacloud-1/issues/1585)) ([6183f3e](https://github.com/zuohuadong/supacloud-1/commit/6183f3e7e985f1fb06a6b31aaf2bab125bb1b34d))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1249](https://github.com/zuohuadong/supacloud-1/issues/1249)) ([76c2d14](https://github.com/zuohuadong/supacloud-1/commit/76c2d14ab9127c4150909af778eb92e969f30e7a))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1303](https://github.com/zuohuadong/supacloud-1/issues/1303)) ([7cf5889](https://github.com/zuohuadong/supacloud-1/commit/7cf588922e5081926e34ae8b2438634e0ea16c2a))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1495](https://github.com/zuohuadong/supacloud-1/issues/1495)) ([ced66da](https://github.com/zuohuadong/supacloud-1/commit/ced66dab53493e875c58f904ef0b3c26a8810928))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1586](https://github.com/zuohuadong/supacloud-1/issues/1586)) ([21f22d8](https://github.com/zuohuadong/supacloud-1/commit/21f22d8dba3a1e6e704865727ed5ff4095d28eac))

## [0.8.0](https://github.com/vibeunion/supacloud/compare/contracts-v0.7.0...contracts-v0.8.0) (2026-10-02)


### Features

* **js:** publish SDK and Contracts as dual MJS and CJS ([#1585](https://github.com/vibeunion/supacloud/issues/1585)) ([6183f3e](https://github.com/vibeunion/supacloud/commit/6183f3e7e985f1fb06a6b31aaf2bab125bb1b34d))

## [0.7.0](https://github.com/vibeunion/supacloud/compare/contracts-v0.6.0...contracts-v0.7.0) (2026-10-02)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/vibeunion/supacloud/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))

## [0.6.0](https://github.com/vibeunion/supacloud/compare/contracts-v0.5.1...contracts-v0.6.0) (2026-09-28)


### Features

* **commands:** persist definitive external rejections ([#1496](https://github.com/vibeunion/supacloud/issues/1496)) ([5c1b816](https://github.com/vibeunion/supacloud/commit/5c1b816e138b7d0415224076621a937142965ea3))

## [0.5.1](https://github.com/vibeunion/supacloud/compare/contracts-v0.5.0...contracts-v0.5.1) (2026-09-28)


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/vibeunion/supacloud/issues/1481)) ([8787ad9](https://github.com/vibeunion/supacloud/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))

## [0.5.0](https://github.com/vibeunion/supacloud/compare/contracts-v0.4.0...contracts-v0.5.0) (2026-09-22)


### Features

* **contracts:** add validated identity, app error and recovery contracts ([#1366](https://github.com/vibeunion/supacloud/issues/1366)) ([2811d97](https://github.com/vibeunion/supacloud/commit/2811d9711431fd5e9b495c67728441883908af4f))

## [0.4.0](https://github.com/vibeunion/supacloud/compare/contracts-v0.3.1...contracts-v0.4.0) (2026-09-15)


### Features

* **elysia:** add read-only command preview ([#1302](https://github.com/vibeunion/supacloud/issues/1302)) ([995bcd4](https://github.com/vibeunion/supacloud/commit/995bcd43ac3639465eab476deefadd0f37867427))

## [0.3.1](https://github.com/vibeunion/supacloud/compare/contracts-v0.3.0...contracts-v0.3.1) (2026-09-11)


### Miscellaneous Chores

* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/vibeunion/supacloud/issues/1271)) ([f53aee5](https://github.com/vibeunion/supacloud/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))

## [0.3.0](https://github.com/vibeunion/supacloud/compare/contracts-v0.2.0...contracts-v0.3.0) (2026-09-11)


### Features

* freeze authored type-safety merge gate ([25e07ea](https://github.com/vibeunion/supacloud/commit/25e07ea1de16cc01a24ed6f001b9bdc729b5ee5e))

## [0.2.0](https://github.com/vibeunion/supacloud/compare/contracts-v0.1.0...contracts-v0.2.0) (2026-09-09)


### ⚠ BREAKING CHANGES

* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/vibeunion/supacloud/issues/1243)) ([6da15d4](https://github.com/vibeunion/supacloud/commit/6da15d459e1883ab94e240834200a57e9a41676b))
