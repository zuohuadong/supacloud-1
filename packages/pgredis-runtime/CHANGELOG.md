# Changelog

## [0.13.0](https://github.com/zuohuadong/supacloud-1/compare/pgredis-runtime-v0.12.0...pgredis-runtime-v0.13.0) (2026-10-31)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/zuohuadong/supacloud-1/issues/1654)) ([39ee49f](https://github.com/zuohuadong/supacloud-1/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **pgredis-runtime:** adopt @postgresx/noredis 0.11 and expose L1 health ([#1424](https://github.com/zuohuadong/supacloud-1/issues/1424)) ([9af9266](https://github.com/zuohuadong/supacloud-1/commit/9af9266fb84abc21a2028a4558d5f35a31cdc1cf))
* **pgredis:** add batch mget/mset cache operations ([#1417](https://github.com/zuohuadong/supacloud-1/issues/1417)) ([ce57b21](https://github.com/zuohuadong/supacloud-1/commit/ce57b21089d29d49653f9f949aa54ad784843707))
* **pgredis:** bound aggregate tenant database concurrency ([#1421](https://github.com/zuohuadong/supacloud-1/issues/1421)) ([53a895c](https://github.com/zuohuadong/supacloud-1/commit/53a895c3400dd1e17460572c2e7e0bf7ec3d04ed))
* **pgredis:** expose L1 hit ratio from upstream cache stats ([#1423](https://github.com/zuohuadong/supacloud-1/issues/1423)) ([5ac9596](https://github.com/zuohuadong/supacloud-1/commit/5ac9596d868cc80ce7524fe915f9dcdfdc6a7842))
* **pgredis:** expose Prometheus metrics for the cache data plane ([#1420](https://github.com/zuohuadong/supacloud-1/issues/1420)) ([b42eb76](https://github.com/zuohuadong/supacloud-1/commit/b42eb76ec3691839699ae85cc5bdfabb664ca339))
* **pgredis:** make L1 invalidation transport pluggable with single-instance mode ([#1419](https://github.com/zuohuadong/supacloud-1/issues/1419)) ([deb1a8e](https://github.com/zuohuadong/supacloud-1/commit/deb1a8e3f8402db992b394c8597286efeb0df565))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))


### Bug Fixes

* pin npm registry for reproducible installs in remaining packages ([#1414](https://github.com/zuohuadong/supacloud-1/issues/1414)) ([8110f3c](https://github.com/zuohuadong/supacloud-1/commit/8110f3c889ac48bc8e4cee35eb37ce7406d35587))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1413](https://github.com/zuohuadong/supacloud-1/issues/1413)) ([0b0f637](https://github.com/zuohuadong/supacloud-1/commit/0b0f637b9eed202f8aa64a3d67ad6469b468bdb9))
* release main ([#1418](https://github.com/zuohuadong/supacloud-1/issues/1418)) ([8338966](https://github.com/zuohuadong/supacloud-1/commit/83389661ceee07141c7dfad14a7ccd47f6940943))
* release main ([#1422](https://github.com/zuohuadong/supacloud-1/issues/1422)) ([00b379b](https://github.com/zuohuadong/supacloud-1/commit/00b379ba5a41deb9dd83276d4bd8bae99fb52b33))
* release main ([#1425](https://github.com/zuohuadong/supacloud-1/issues/1425)) ([32d7301](https://github.com/zuohuadong/supacloud-1/commit/32d7301eae6048c72434b8fa532e97bdab5fca04))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))

## [0.12.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.11.0...pgredis-runtime-v0.12.0) (2026-10-05)


### Features

* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/vibeunion/supacloud/issues/1654)) ([39ee49f](https://github.com/vibeunion/supacloud/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))

## [0.11.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.10.1...pgredis-runtime-v0.11.0) (2026-10-02)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/vibeunion/supacloud/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))

## [0.10.1](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.10.0...pgredis-runtime-v0.10.1) (2026-09-28)


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/vibeunion/supacloud/issues/1481)) ([8787ad9](https://github.com/vibeunion/supacloud/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))

## [0.10.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.9.0...pgredis-runtime-v0.10.0) (2026-09-28)


### Features

* integrate application delivery and platform runtime support ([#1453](https://github.com/vibeunion/supacloud/issues/1453)) ([68594fb](https://github.com/vibeunion/supacloud/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))

## [0.9.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.8.0...pgredis-runtime-v0.9.0) (2026-09-24)


### Features

* **pgredis-runtime:** adopt @postgresx/noredis 0.11 and expose L1 health ([#1424](https://github.com/vibeunion/supacloud/issues/1424)) ([9af9266](https://github.com/vibeunion/supacloud/commit/9af9266fb84abc21a2028a4558d5f35a31cdc1cf))

## [0.8.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.7.0...pgredis-runtime-v0.8.0) (2026-09-24)


### Features

* **pgredis:** bound aggregate tenant database concurrency ([#1421](https://github.com/vibeunion/supacloud/issues/1421)) ([53a895c](https://github.com/vibeunion/supacloud/commit/53a895c3400dd1e17460572c2e7e0bf7ec3d04ed))
* **pgredis:** expose L1 hit ratio from upstream cache stats ([#1423](https://github.com/vibeunion/supacloud/issues/1423)) ([5ac9596](https://github.com/vibeunion/supacloud/commit/5ac9596d868cc80ce7524fe915f9dcdfdc6a7842))

## [0.7.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.6.2...pgredis-runtime-v0.7.0) (2026-09-24)


### Features

* **pgredis:** add batch mget/mset cache operations ([#1417](https://github.com/vibeunion/supacloud/issues/1417)) ([ce57b21](https://github.com/vibeunion/supacloud/commit/ce57b21089d29d49653f9f949aa54ad784843707))
* **pgredis:** expose Prometheus metrics for the cache data plane ([#1420](https://github.com/vibeunion/supacloud/issues/1420)) ([b42eb76](https://github.com/vibeunion/supacloud/commit/b42eb76ec3691839699ae85cc5bdfabb664ca339))
* **pgredis:** make L1 invalidation transport pluggable with single-instance mode ([#1419](https://github.com/vibeunion/supacloud/issues/1419)) ([deb1a8e](https://github.com/vibeunion/supacloud/commit/deb1a8e3f8402db992b394c8597286efeb0df565))

## [0.6.2](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.6.1...pgredis-runtime-v0.6.2) (2026-09-24)


### Bug Fixes

* pin npm registry for reproducible installs in remaining packages ([#1414](https://github.com/vibeunion/supacloud/issues/1414)) ([8110f3c](https://github.com/vibeunion/supacloud/commit/8110f3c889ac48bc8e4cee35eb37ce7406d35587))

## [0.6.1](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.6.0...pgredis-runtime-v0.6.1) (2026-09-11)


### Miscellaneous Chores

* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/vibeunion/supacloud/issues/1271)) ([f53aee5](https://github.com/vibeunion/supacloud/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))

## [0.6.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.5.0...pgredis-runtime-v0.6.0) (2026-09-05)


### Features

* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/vibeunion/supacloud/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))

## [0.5.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.4.0...pgredis-runtime-v0.5.0) (2026-09-04)


### Features

* **pgredis:** add extension policy and expired row cleanup ([#1141](https://github.com/vibeunion/supacloud/issues/1141)) ([6d0ea1d](https://github.com/vibeunion/supacloud/commit/6d0ea1de317bf1fee3f57771bee338fb7cff475d))


### Bug Fixes

* **pgredis:** consume namespace-scoped cleanup release ([#1143](https://github.com/vibeunion/supacloud/issues/1143)) ([62739a7](https://github.com/vibeunion/supacloud/commit/62739a79a57776c02e5ff9456acac149a246862f))

## [0.4.0](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.3.4...pgredis-runtime-v0.4.0) (2026-09-03)


### Features

* **compiler,app:** add module tags and boundary governance with Nx workspace configuration ([#1110](https://github.com/vibeunion/supacloud/issues/1110)) ([dda9635](https://github.com/vibeunion/supacloud/commit/dda96355ba25a53f1b550e8e95011b1c806a2003))

## [0.3.4](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.3.3...pgredis-runtime-v0.3.4) (2026-08-29)


### Miscellaneous Chores

* **deps:** upgrade workspace dependencies and svadmin ([#1067](https://github.com/vibeunion/supacloud/issues/1067)) ([9cd8ed6](https://github.com/vibeunion/supacloud/commit/9cd8ed6e81f11da1b26bf491ca745b5599115cc0))

## [0.3.3](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.3.2...pgredis-runtime-v0.3.3) (2026-08-23)


### Miscellaneous Chores

* **runtime:** upgrade Bun to 1.4.0 ([a1e4178](https://github.com/vibeunion/supacloud/commit/a1e4178c6a02127e4b71b0976d0f34a5a7940061))

## [0.3.2](https://github.com/vibeunion/supacloud/compare/pgredis-runtime-v0.3.1...pgredis-runtime-v0.3.2) (2026-08-16)


### Bug Fixes

* **pgredis-runtime:** update PostgresX dependencies ([#935](https://github.com/vibeunion/supacloud/issues/935)) ([bb1f286](https://github.com/vibeunion/supacloud/commit/bb1f286ee1277c73741d2a8b53b61f1b24cfd193))

## [0.3.1](https://github.com/zuohuadong/supacloud/compare/pgredis-runtime-v0.3.0...pgredis-runtime-v0.3.1) (2026-07-30)


### Bug Fixes

* address reported Studio and platform defects ([19656bb](https://github.com/zuohuadong/supacloud/commit/19656bb19f73ec94581cf38370fffaae8321378d))

## [0.3.0](https://github.com/zuohuadong/supacloud/compare/pgredis-runtime-v0.2.0...pgredis-runtime-v0.3.0) (2026-07-27)


### Features

* **cache:** add pgredis control plane and console ([76000b8](https://github.com/zuohuadong/supacloud/commit/76000b862f0dda088244012f4915da9f9a1bd57a))


### Bug Fixes

* **pgredis:** align test cache doubles with interfaces ([bb68c0f](https://github.com/zuohuadong/supacloud/commit/bb68c0f9f2b3ec8fc797254bf0001ac6a9e7cd3a))


### Miscellaneous Chores

* **release:** clean pgredis release notes ([e78a311](https://github.com/zuohuadong/supacloud/commit/e78a311ad9d69435c8bd86f81747c93899b4d6ca))

## [0.2.0](https://github.com/zuohuadong/supacloud/compare/pgredis-runtime-v0.1.0...pgredis-runtime-v0.2.0) (2026-07-27)


### Features

* add PostgreSQL cache data plane runtime ([f0c19f4](https://github.com/zuohuadong/supacloud/commit/f0c19f4f870bd0b26d453a67b8af76d609c53d64))
