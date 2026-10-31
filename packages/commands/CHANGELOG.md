# Changelog

## [0.10.0](https://github.com/zuohuadong/supacloud-1/compare/commands-v0.9.1...commands-v0.10.0) (2026-10-31)


### ⚠ BREAKING CHANGES

* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **commands:** adopt validated command references ([#1367](https://github.com/zuohuadong/supacloud-1/issues/1367)) ([929b3ff](https://github.com/zuohuadong/supacloud-1/commit/929b3ff79066957a8c7a85e57367723360621441))
* **commands:** persist definitive external rejections ([#1496](https://github.com/zuohuadong/supacloud-1/issues/1496)) ([5c1b816](https://github.com/zuohuadong/supacloud-1/commit/5c1b816e138b7d0415224076621a937142965ea3))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* complete compile-time database architecture ([#1332](https://github.com/zuohuadong/supacloud-1/issues/1332)) ([4a82b4b](https://github.com/zuohuadong/supacloud-1/commit/4a82b4b89078ef371029c6d18b7c674086627a88))
* **framework:** add command composition and recovery observability ([#1432](https://github.com/zuohuadong/supacloud-1/issues/1432)) ([456efcd](https://github.com/zuohuadong/supacloud-1/commit/456efcd807deabeb3f3df6d718c47c427673b1f5))
* **framework:** complete schema-first route contracts ([#1304](https://github.com/zuohuadong/supacloud-1/issues/1304)) ([4acc3ac](https://github.com/zuohuadong/supacloud-1/commit/4acc3aced2b6e3202705dd87071131af631abad2))
* freeze authored type-safety merge gate ([25e07ea](https://github.com/zuohuadong/supacloud-1/commit/25e07ea1de16cc01a24ed6f001b9bdc729b5ee5e))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))
* **web-console:** productize durable webhook delivery ([9288fc0](https://github.com/zuohuadong/supacloud-1/commit/9288fc064a37176363e7d2f370ec658ed73e4e40))


### Documentation

* complete compile-time architecture usage guides ([#1333](https://github.com/zuohuadong/supacloud-1/issues/1333)) ([3190178](https://github.com/zuohuadong/supacloud-1/commit/319017810deb4d7c9911f1bd001ca898f9ea9982))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1249](https://github.com/zuohuadong/supacloud-1/issues/1249)) ([76c2d14](https://github.com/zuohuadong/supacloud-1/commit/76c2d14ab9127c4150909af778eb92e969f30e7a))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1303](https://github.com/zuohuadong/supacloud-1/issues/1303)) ([7cf5889](https://github.com/zuohuadong/supacloud-1/commit/7cf588922e5081926e34ae8b2438634e0ea16c2a))
* release main ([#1330](https://github.com/zuohuadong/supacloud-1/issues/1330)) ([95384f8](https://github.com/zuohuadong/supacloud-1/commit/95384f8db80b2706b30953f26944cc681f810543))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1431](https://github.com/zuohuadong/supacloud-1/issues/1431)) ([b7255e6](https://github.com/zuohuadong/supacloud-1/commit/b7255e6fbb277e0fdcbbe7cfeacc81cee62f7fe2))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1495](https://github.com/zuohuadong/supacloud-1/issues/1495)) ([ced66da](https://github.com/zuohuadong/supacloud-1/commit/ced66dab53493e875c58f904ef0b3c26a8810928))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))

## [0.9.1](https://github.com/vibeunion/supacloud/compare/commands-v0.9.0...commands-v0.9.1) (2026-10-05)


### Miscellaneous Chores

* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/vibeunion/supacloud/issues/1655)) ([87d1133](https://github.com/vibeunion/supacloud/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))

## [0.9.0](https://github.com/vibeunion/supacloud/compare/commands-v0.8.0...commands-v0.9.0) (2026-10-02)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/vibeunion/supacloud/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))

## [0.8.0](https://github.com/vibeunion/supacloud/compare/commands-v0.7.1...commands-v0.8.0) (2026-09-28)


### Features

* **commands:** persist definitive external rejections ([#1496](https://github.com/vibeunion/supacloud/issues/1496)) ([5c1b816](https://github.com/vibeunion/supacloud/commit/5c1b816e138b7d0415224076621a937142965ea3))

## [0.7.1](https://github.com/vibeunion/supacloud/compare/commands-v0.7.0...commands-v0.7.1) (2026-09-28)


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/vibeunion/supacloud/issues/1481)) ([8787ad9](https://github.com/vibeunion/supacloud/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))

## [0.7.0](https://github.com/vibeunion/supacloud/compare/commands-v0.6.0...commands-v0.7.0) (2026-09-26)


### Features

* **framework:** add command composition and recovery observability ([#1432](https://github.com/vibeunion/supacloud/issues/1432)) ([456efcd](https://github.com/vibeunion/supacloud/commit/456efcd807deabeb3f3df6d718c47c427673b1f5))

## [0.6.0](https://github.com/vibeunion/supacloud/compare/commands-v0.5.0...commands-v0.6.0) (2026-09-22)


### Features

* **commands:** adopt validated command references ([#1367](https://github.com/vibeunion/supacloud/issues/1367)) ([929b3ff](https://github.com/vibeunion/supacloud/commit/929b3ff79066957a8c7a85e57367723360621441))

## [0.5.0](https://github.com/vibeunion/supacloud/compare/commands-v0.4.0...commands-v0.5.0) (2026-09-16)


### Features

* complete compile-time database architecture ([#1332](https://github.com/vibeunion/supacloud/issues/1332)) ([4a82b4b](https://github.com/vibeunion/supacloud/commit/4a82b4b89078ef371029c6d18b7c674086627a88))


### Documentation

* complete compile-time architecture usage guides ([#1333](https://github.com/vibeunion/supacloud/issues/1333)) ([3190178](https://github.com/vibeunion/supacloud/commit/319017810deb4d7c9911f1bd001ca898f9ea9982))

## [0.4.0](https://github.com/vibeunion/supacloud/compare/commands-v0.3.1...commands-v0.4.0) (2026-09-15)


### Features

* **framework:** complete schema-first route contracts ([#1304](https://github.com/vibeunion/supacloud/issues/1304)) ([4acc3ac](https://github.com/vibeunion/supacloud/commit/4acc3aced2b6e3202705dd87071131af631abad2))

## [0.3.1](https://github.com/vibeunion/supacloud/compare/commands-v0.3.0...commands-v0.3.1) (2026-09-11)


### Miscellaneous Chores

* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/vibeunion/supacloud/issues/1271)) ([f53aee5](https://github.com/vibeunion/supacloud/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))

## [0.3.0](https://github.com/vibeunion/supacloud/compare/commands-v0.2.0...commands-v0.3.0) (2026-09-11)


### Features

* freeze authored type-safety merge gate ([25e07ea](https://github.com/vibeunion/supacloud/commit/25e07ea1de16cc01a24ed6f001b9bdc729b5ee5e))

## [0.2.0](https://github.com/vibeunion/supacloud/compare/commands-v0.1.0...commands-v0.2.0) (2026-09-09)


### ⚠ BREAKING CHANGES

* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/vibeunion/supacloud/issues/1243)) ([6da15d4](https://github.com/vibeunion/supacloud/commit/6da15d459e1883ab94e240834200a57e9a41676b))
