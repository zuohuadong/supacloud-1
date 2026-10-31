# Changelog

## [0.14.0](https://github.com/zuohuadong/supacloud-1/compare/db-v0.13.1...db-v0.14.0) (2026-10-31)


### ⚠ BREAKING CHANGES

* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **commands:** persist definitive external rejections ([#1496](https://github.com/zuohuadong/supacloud-1/issues/1496)) ([5c1b816](https://github.com/zuohuadong/supacloud-1/commit/5c1b816e138b7d0415224076621a937142965ea3))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* complete compile-time database architecture ([#1332](https://github.com/zuohuadong/supacloud-1/issues/1332)) ([4a82b4b](https://github.com/zuohuadong/supacloud-1/commit/4a82b4b89078ef371029c6d18b7c674086627a88))
* converge SDK-aware vibecoding defaults and local development ([#1607](https://github.com/zuohuadong/supacloud-1/issues/1607)) ([cd66672](https://github.com/zuohuadong/supacloud-1/commit/cd6667252a6a8fe0cc0539bc8610ebb8a818af51))
* **db:** add decoder-inferred RPC contracts ([#1198](https://github.com/zuohuadong/supacloud-1/issues/1198)) ([6c404e9](https://github.com/zuohuadong/supacloud-1/commit/6c404e901ff64d3a72817410ffad1656b7274f7b))
* **db:** add target-bound migration template rendering ([#1207](https://github.com/zuohuadong/supacloud-1/issues/1207)) ([9af38ae](https://github.com/zuohuadong/supacloud-1/commit/9af38aef91351cf576869a2cbb7dc8c85c2442de))
* **db:** default database starters to Drizzle and source-contract gates ([#1599](https://github.com/zuohuadong/supacloud-1/issues/1599)) ([133eb9b](https://github.com/zuohuadong/supacloud-1/commit/133eb9b0d3a6be3690c290041db3906635a376e7))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))


### Documentation

* complete compile-time architecture usage guides ([#1333](https://github.com/zuohuadong/supacloud-1/issues/1333)) ([3190178](https://github.com/zuohuadong/supacloud-1/commit/319017810deb4d7c9911f1bd001ca898f9ea9982))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1199](https://github.com/zuohuadong/supacloud-1/issues/1199)) ([f374806](https://github.com/zuohuadong/supacloud-1/commit/f3748068f6f0a838b668b81a7b23f9cffd74ca37))
* release main ([#1208](https://github.com/zuohuadong/supacloud-1/issues/1208)) ([6ff2c13](https://github.com/zuohuadong/supacloud-1/commit/6ff2c13b9ea7e3ab1a86dda3452645cd3d115c8a))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1330](https://github.com/zuohuadong/supacloud-1/issues/1330)) ([95384f8](https://github.com/zuohuadong/supacloud-1/commit/95384f8db80b2706b30953f26944cc681f810543))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1495](https://github.com/zuohuadong/supacloud-1/issues/1495)) ([ced66da](https://github.com/zuohuadong/supacloud-1/commit/ced66dab53493e875c58f904ef0b3c26a8810928))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1600](https://github.com/zuohuadong/supacloud-1/issues/1600)) ([5209a75](https://github.com/zuohuadong/supacloud-1/commit/5209a7589b785d8243be24ad3ec25a0ccdb7b42c))
* release main ([#1609](https://github.com/zuohuadong/supacloud-1/issues/1609)) ([b52c79c](https://github.com/zuohuadong/supacloud-1/commit/b52c79ceda912786f1299ae2d618172f9252607a))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))

## [0.13.1](https://github.com/vibeunion/supacloud/compare/db-v0.13.0...db-v0.13.1) (2026-10-05)


### Miscellaneous Chores

* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/vibeunion/supacloud/issues/1655)) ([87d1133](https://github.com/vibeunion/supacloud/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))

## [0.13.0](https://github.com/vibeunion/supacloud/compare/db-v0.12.0...db-v0.13.0) (2026-10-03)


### Features

* converge SDK-aware vibecoding defaults and local development ([#1607](https://github.com/vibeunion/supacloud/issues/1607)) ([cd66672](https://github.com/vibeunion/supacloud/commit/cd6667252a6a8fe0cc0539bc8610ebb8a818af51))

## [0.12.0](https://github.com/vibeunion/supacloud/compare/db-v0.11.0...db-v0.12.0) (2026-10-03)


### Features

* **db:** default database starters to Drizzle and source-contract gates ([#1599](https://github.com/vibeunion/supacloud/issues/1599)) ([133eb9b](https://github.com/vibeunion/supacloud/commit/133eb9b0d3a6be3690c290041db3906635a376e7))

## [0.11.0](https://github.com/vibeunion/supacloud/compare/db-v0.10.0...db-v0.11.0) (2026-10-02)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/vibeunion/supacloud/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))

## [0.10.0](https://github.com/vibeunion/supacloud/compare/db-v0.9.1...db-v0.10.0) (2026-09-28)


### Features

* **commands:** persist definitive external rejections ([#1496](https://github.com/vibeunion/supacloud/issues/1496)) ([5c1b816](https://github.com/vibeunion/supacloud/commit/5c1b816e138b7d0415224076621a937142965ea3))

## [0.9.1](https://github.com/vibeunion/supacloud/compare/db-v0.9.0...db-v0.9.1) (2026-09-28)


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/vibeunion/supacloud/issues/1481)) ([8787ad9](https://github.com/vibeunion/supacloud/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))

## [0.9.0](https://github.com/vibeunion/supacloud/compare/db-v0.8.0...db-v0.9.0) (2026-09-28)


### Features

* integrate application delivery and platform runtime support ([#1453](https://github.com/vibeunion/supacloud/issues/1453)) ([68594fb](https://github.com/vibeunion/supacloud/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))

## [0.8.0](https://github.com/vibeunion/supacloud/compare/db-v0.7.1...db-v0.8.0) (2026-09-16)


### Features

* complete compile-time database architecture ([#1332](https://github.com/vibeunion/supacloud/issues/1332)) ([4a82b4b](https://github.com/vibeunion/supacloud/commit/4a82b4b89078ef371029c6d18b7c674086627a88))


### Documentation

* complete compile-time architecture usage guides ([#1333](https://github.com/vibeunion/supacloud/issues/1333)) ([3190178](https://github.com/vibeunion/supacloud/commit/319017810deb4d7c9911f1bd001ca898f9ea9982))

## [0.7.1](https://github.com/vibeunion/supacloud/compare/db-v0.7.0...db-v0.7.1) (2026-09-11)


### Miscellaneous Chores

* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/vibeunion/supacloud/issues/1271)) ([f53aee5](https://github.com/vibeunion/supacloud/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))

## [0.7.0](https://github.com/vibeunion/supacloud/compare/db-v0.6.0...db-v0.7.0) (2026-09-09)


### ⚠ BREAKING CHANGES

* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/vibeunion/supacloud/issues/1243)) ([6da15d4](https://github.com/vibeunion/supacloud/commit/6da15d459e1883ab94e240834200a57e9a41676b))

## [0.6.0](https://github.com/vibeunion/supacloud/compare/db-v0.5.0...db-v0.6.0) (2026-09-08)


### Features

* **db:** add target-bound migration template rendering ([#1207](https://github.com/vibeunion/supacloud/issues/1207)) ([9af38ae](https://github.com/vibeunion/supacloud/commit/9af38aef91351cf576869a2cbb7dc8c85c2442de))

## [0.5.0](https://github.com/vibeunion/supacloud/compare/db-v0.4.0...db-v0.5.0) (2026-09-07)


### Features

* **db:** add decoder-inferred RPC contracts ([#1198](https://github.com/vibeunion/supacloud/issues/1198)) ([6c404e9](https://github.com/vibeunion/supacloud/commit/6c404e901ff64d3a72817410ffad1656b7274f7b))

## [0.4.0](https://github.com/vibeunion/supacloud/compare/db-v0.3.1...db-v0.4.0) (2026-09-05)


### Features

* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/vibeunion/supacloud/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))

## [0.3.1](https://github.com/vibeunion/supacloud/compare/db-v0.3.0...db-v0.3.1) (2026-09-04)


### Miscellaneous Chores

* unify all code comments to English across packages ([#1136](https://github.com/vibeunion/supacloud/issues/1136)) ([2587201](https://github.com/vibeunion/supacloud/commit/2587201347494975cd313ff3aa4b0c5c3af48780))

## [0.3.0](https://github.com/vibeunion/supacloud/compare/db-v0.2.0...db-v0.3.0) (2026-09-03)


### Features

* **compiler,app:** add module tags and boundary governance with Nx workspace configuration ([#1110](https://github.com/vibeunion/supacloud/issues/1110)) ([dda9635](https://github.com/vibeunion/supacloud/commit/dda96355ba25a53f1b550e8e95011b1c806a2003))

## [0.2.0](https://github.com/vibeunion/supacloud/compare/db-v0.1.0...db-v0.2.0) (2026-09-02)


### Features

* **app:** add command governance boundaries ([#1104](https://github.com/vibeunion/supacloud/issues/1104)) ([48b6f4f](https://github.com/vibeunion/supacloud/commit/48b6f4f1dc9c8f474faa325172ee9f20b42d8332))
* **db:** trigger reconcile and transactional plan/apply executor ([#1106](https://github.com/vibeunion/supacloud/issues/1106)) ([49a258b](https://github.com/vibeunion/supacloud/commit/49a258bfadffd84301239eb8f7c7519f2c84b909))

## 0.1.0 (2026-09-02)


### Features

* add database governance and testing packages (db, testing) ([#1083](https://github.com/vibeunion/supacloud/issues/1083)) ([5bb08b9](https://github.com/vibeunion/supacloud/commit/5bb08b90b7bdac3f721ded39af525ca02bd289cb))
