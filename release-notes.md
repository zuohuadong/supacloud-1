:robot: I have created a release *beep* *boop*
---


<details><summary>management-api: 0.98.0</summary>

## [0.98.0](https://github.com/zuohuadong/supacloud-1/compare/management-api-v0.97.1...management-api-v0.98.0) (2026-10-31)


###   BREAKING CHANGES

* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* add agent backend authoring, runtime and observability workflows ([#1648](https://github.com/zuohuadong/supacloud-1/issues/1648)) ([59a66d1](https://github.com/zuohuadong/supacloud-1/commit/59a66d184a47d19c7f8895f24a6ba2c7e74e93d0))
* adopt Pigsty Silo MinIO fork, expose environment/version APIs, and storage upload constraints ([#1279](https://github.com/zuohuadong/supacloud-1/issues/1279)) ([e47b25b](https://github.com/zuohuadong/supacloud-1/commit/e47b25bdc61935e901f0e98b7eb2a84dcf221e89))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **architecture:** enforce compile-time application governance ([#1301](https://github.com/zuohuadong/supacloud-1/issues/1301)) ([b2c1df2](https://github.com/zuohuadong/supacloud-1/commit/b2c1df25294d0195ddf313623b965e599847d9f9))
* **auth:** add project OAuth Server console and GoTrue admin proxy ([#1293](https://github.com/zuohuadong/supacloud-1/issues/1293)) ([2cbc565](https://github.com/zuohuadong/supacloud-1/commit/2cbc5657ee59d173869cbf36d979b14babd81e56))
* **backup:** add isolated project restore drills and signed evidence ([#1217](https://github.com/zuohuadong/supacloud-1/issues/1217)) ([e74b007](https://github.com/zuohuadong/supacloud-1/commit/e74b0076d811df5f3d74b20703a88b596ecb7407))
* **cli:** add application delivery workflow ([#1490](https://github.com/zuohuadong/supacloud-1/issues/1490)) ([da5b4e4](https://github.com/zuohuadong/supacloud-1/commit/da5b4e4098b0478553cc09876217441e24aa8f04))
* **cli:** support configurable upload body limits for edge functions and host install ([#1274](https://github.com/zuohuadong/supacloud-1/issues/1274)) ([5f9e85a](https://github.com/zuohuadong/supacloud-1/commit/5f9e85aa502e06e739fa9e6d43e2bcc1f94d721a))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* **console:** safely inspect delivered application development context ([#1522](https://github.com/zuohuadong/supacloud-1/issues/1522)) ([db25fc2](https://github.com/zuohuadong/supacloud-1/commit/db25fc2844a18aea660e5fdd5249486f40ec1458))
* default RxJS support with compatible SupaCloud JS calls ([#1556](https://github.com/zuohuadong/supacloud-1/issues/1556)) ([b3015cb](https://github.com/zuohuadong/supacloud-1/commit/b3015cb161c0d87e6611f6c4fc60c120a8c9fffe))
* **delivery:** expose deployment evidence through management surfaces ([2efb236](https://github.com/zuohuadong/supacloud-1/commit/2efb23664cec5a86b0535c530f91a5c7a871626b))
* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/zuohuadong/supacloud-1/issues/1654)) ([39ee49f](https://github.com/zuohuadong/supacloud-1/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))
* establish single-node delivery baseline ([#1632](https://github.com/zuohuadong/supacloud-1/issues/1632)) ([926de6c](https://github.com/zuohuadong/supacloud-1/commit/926de6c6c72940f7c03e046908ef446c54d37621))
* expose application task links for background execution ([#1406](https://github.com/zuohuadong/supacloud-1/issues/1406)) ([24995b1](https://github.com/zuohuadong/supacloud-1/commit/24995b169cfe81888bb187c8f2e6f0775e816d62))
* **extensions:** manage canonical pgflow installation and pause state ([#1331](https://github.com/zuohuadong/supacloud-1/issues/1331)) ([aa666eb](https://github.com/zuohuadong/supacloud-1/commit/aa666eb48130508f39a41523d8aeefdf25912e9a))
* **framework:** complete schema-first route contracts ([#1304](https://github.com/zuohuadong/supacloud-1/issues/1304)) ([4acc3ac](https://github.com/zuohuadong/supacloud-1/commit/4acc3aced2b6e3202705dd87071131af631abad2))
* **functions:** publish atomic project release manifests ([#1215](https://github.com/zuohuadong/supacloud-1/issues/1215)) ([e4c582f](https://github.com/zuohuadong/supacloud-1/commit/e4c582f55a88e47cf4795cfe8e42b8672791dce8))
* **hosting:** add frontend hosting environments, versions, and console ([#1292](https://github.com/zuohuadong/supacloud-1/issues/1292)) ([4a5dc78](https://github.com/zuohuadong/supacloud-1/commit/4a5dc78cbb827ff22e5b714c3311c377db44ea67))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* **management-api:** add generic release control contract ([#1180](https://github.com/zuohuadong/supacloud-1/issues/1180)) ([0759b6b](https://github.com/zuohuadong/supacloud-1/commit/0759b6b7175b24f2a676c8a632f2f94704b828de))
* **management-api:** add PGMQ queue settings, batch ingestion, and queue governance ([#1291](https://github.com/zuohuadong/supacloud-1/issues/1291)) ([8362642](https://github.com/zuohuadong/supacloud-1/commit/8362642267c18f92beee2e3f5833eef3945651a0))
* **management-api:** add project CLI client and proof-nonce repository ([#1375](https://github.com/zuohuadong/supacloud-1/issues/1375)) ([5ca9522](https://github.com/zuohuadong/supacloud-1/commit/5ca952239210a3fd67826f55e52c453df96888a8))
* **management-api:** add stateless MCP AI operations ([bf007f1](https://github.com/zuohuadong/supacloud-1/commit/bf007f14e47f9ac31a2bb99518281ee409d27a9d))
* **management-api:** add validated projection contract helpers ([#1374](https://github.com/zuohuadong/supacloud-1/issues/1374)) ([a993957](https://github.com/zuohuadong/supacloud-1/commit/a9939578f529cf9eb9e1b20844e509c8a023c579))
* **management-api:** bind realtime subscriptions to their session identity ([#1373](https://github.com/zuohuadong/supacloud-1/issues/1373)) ([ff8f6d9](https://github.com/zuohuadong/supacloud-1/commit/ff8f6d9939ff7e1dfea78728c7d50f37c5652f74))
* **management-api:** Developer MCP reads application development context (P1-4) ([#1519](https://github.com/zuohuadong/supacloud-1/issues/1519)) ([7d7f0e9](https://github.com/zuohuadong/supacloud-1/commit/7d7f0e9d1d3263614fb1104c3168521e21b69832))
* **management-api:** validate the project dashboard summary route ([f1e7bc1](https://github.com/zuohuadong/supacloud-1/commit/f1e7bc14911d2a97dd9ac17414bc681e68bfa991))
* **management:** integrate pgflow execution with project tasks ([#1325](https://github.com/zuohuadong/supacloud-1/issues/1325)) ([10e977c](https://github.com/zuohuadong/supacloud-1/commit/10e977c42da0e945c60e0b90412f37d0fcc5e9ed))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **observability:** trace request and background function execution ([#1212](https://github.com/zuohuadong/supacloud-1/issues/1212)) ([589b1e8](https://github.com/zuohuadong/supacloud-1/commit/589b1e8ac07ea9e91f4a486221a90bf952b2d92d))
* **platform:** connect deployment evidence to console and mcp ([f86af1c](https://github.com/zuohuadong/supacloud-1/commit/f86af1c4be4346452cdc580f51ced7a38555d0dc))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))
* **sdk:** support capabilities probing and storage upload constraints in supacloud-js ([#1277](https://github.com/zuohuadong/supacloud-1/issues/1277)) ([c4eda8a](https://github.com/zuohuadong/supacloud-1/commit/c4eda8a105535c37da09bb03f19ddee616257c47))
* **storage:** migrate image transforms to imagor ([68308fc](https://github.com/zuohuadong/supacloud-1/commit/68308fc1d9071f28dffb999e44099b4f8f8989ab))
* **storage:** support independent S3 backends per project ([#1470](https://github.com/zuohuadong/supacloud-1/issues/1470)) ([9d1efa3](https://github.com/zuohuadong/supacloud-1/commit/9d1efa338d71e06127d1d1656d54b771f78bce14))
* **supacloud-js:** add durable workflow, command, artifact, and queue RPC client ([#1290](https://github.com/zuohuadong/supacloud-1/issues/1290)) ([0183c74](https://github.com/zuohuadong/supacloud-1/commit/0183c7441988902fcad98b25bd80b8cb15d254de))
* **tasks:** durable output replay, attempt fencing and quotas without gRPC ([#1356](https://github.com/zuohuadong/supacloud-1/issues/1356)) ([6866b80](https://github.com/zuohuadong/supacloud-1/commit/6866b808e99910ffe145788eb22f43bcf21b008e))
* **tasks:** observe externally managed pgflow runs read-only ([#1411](https://github.com/zuohuadong/supacloud-1/issues/1411)) ([3df9997](https://github.com/zuohuadong/supacloud-1/commit/3df999711d452f9fab4647a131d506a1c61d2b0f))
* **web-console:** drive project pooling through the validated state API ([2316899](https://github.com/zuohuadong/supacloud-1/commit/23168990d8a8c0820a84acdae83804449b2210d9))
* **web-console:** rebuild the project overview on validated contracts ([f28428a](https://github.com/zuohuadong/supacloud-1/commit/f28428ad9d2ec55d0c742f2fe539f1bc769e2fab))
* **web-console:** upgrade svadmin and type auth mutations ([#1662](https://github.com/zuohuadong/supacloud-1/issues/1662)) ([b7bc46c](https://github.com/zuohuadong/supacloud-1/commit/b7bc46cb3aeb57decd9265699cc66a6dd8c0d4ea))
* **web-console:** wire dashboard and project routes to validated contracts ([#1384](https://github.com/zuohuadong/supacloud-1/issues/1384)) ([15f5913](https://github.com/zuohuadong/supacloud-1/commit/15f5913516ca128dac03177533072bd1b7f5eb3d))
* **worker:** add bounded runtime recipes and native adapter ([#1618](https://github.com/zuohuadong/supacloud-1/issues/1618)) ([335354c](https://github.com/zuohuadong/supacloud-1/commit/335354c988e63f7c58ff79d7210a9af20814e911))
* **worker:** add Graphile-style PGMQ job controls ([d1f9832](https://github.com/zuohuadong/supacloud-1/commit/d1f9832306582d361dd6005fae79c362b8a5d0ae))
* **worker:** add tenant-scoped pgflow runtime and shared PG18 installation ([#1329](https://github.com/zuohuadong/supacloud-1/issues/1329)) ([5149870](https://github.com/zuohuadong/supacloud-1/commit/51498703d15b2f3a6e4ec72e01177013b31a3068))
* **worker:** bounded execution groups and admission controls ([#1616](https://github.com/zuohuadong/supacloud-1/issues/1616)) ([8d870ea](https://github.com/zuohuadong/supacloud-1/commit/8d870eabfce9bedce75d42151f5085bcef19b4c1))


### Bug Fixes

* **auth:** preserve SupAuth JSONB contract shapes ([#1509](https://github.com/zuohuadong/supacloud-1/issues/1509)) ([bb23592](https://github.com/zuohuadong/supacloud-1/commit/bb235927f38f684503d4e172acee762439794afc))
* bound edge-function immutable version history ([#1563](https://github.com/zuohuadong/supacloud-1/issues/1563)) ([793723c](https://github.com/zuohuadong/supacloud-1/commit/793723cc55a5184e3b25ab401502e8a49f044eac))
* **ci:** avoid ECR data limit for Realtime fixture ([#1458](https://github.com/zuohuadong/supacloud-1/issues/1458)) ([17cac42](https://github.com/zuohuadong/supacloud-1/commit/17cac424cd521ccb1624e7bf4bb5caeb6708c59b))
* **ci:** bootstrap delivery dependencies for binary releases ([#1456](https://github.com/zuohuadong/supacloud-1/issues/1456)) ([e5cdc86](https://github.com/zuohuadong/supacloud-1/commit/e5cdc868c75e7e0884215127374442ca29d522ce))
* **ci:** recover empty management releases from exact tags ([#1459](https://github.com/zuohuadong/supacloud-1/issues/1459)) ([9597609](https://github.com/zuohuadong/supacloud-1/commit/9597609cb27b2a3279ece102b757637cc8fd993f))
* **diagnostics:** respect embedded edge runtime mode ([#1158](https://github.com/zuohuadong/supacloud-1/issues/1158)) ([e04ed1a](https://github.com/zuohuadong/supacloud-1/commit/e04ed1af98e89ae58c9d748230de2d473ef4b5fd))
* **edge-functions:** recover unacknowledged activation begin ([#1278](https://github.com/zuohuadong/supacloud-1/issues/1278)) ([fab21dd](https://github.com/zuohuadong/supacloud-1/commit/fab21dda8cedb927145876d50f5ce18be79087d0))
* **edge-runtime:** bound background capacity and repair log ownership ([#1497](https://github.com/zuohuadong/supacloud-1/issues/1497)) ([0370080](https://github.com/zuohuadong/supacloud-1/commit/0370080a9a333542732e34ba3b11efea49c14fd8))
* **gateway:** compress migration inventory responses ([#1535](https://github.com/zuohuadong/supacloud-1/issues/1535)) ([431261f](https://github.com/zuohuadong/supacloud-1/commit/431261fc850b993bff26b9d01843a6df524bd44b))
* **gateway:** preserve custom route CORS during reconciliation ([#1213](https://github.com/zuohuadong/supacloud-1/issues/1213)) ([9fbfdd9](https://github.com/zuohuadong/supacloud-1/commit/9fbfdd9e82ec29ace7034d429453512ab7952978))
* **management-api:** degrade project detail status probe failures ([#1167](https://github.com/zuohuadong/supacloud-1/issues/1167)) ([d1e9f50](https://github.com/zuohuadong/supacloud-1/commit/d1e9f50aec32b2d8ceaf83ae1092ecf90e9fecbd))
* **management-api:** harden watchdog and deduplicate immutable function artifacts ([#1549](https://github.com/zuohuadong/supacloud-1/issues/1549)) ([f6821a8](https://github.com/zuohuadong/supacloud-1/commit/f6821a81b7ea56f0a3ccdb20104b6114a0eadafd))
* **management-api:** keep request latency histogram cumulative ([#1209](https://github.com/zuohuadong/supacloud-1/issues/1209)) ([1c137db](https://github.com/zuohuadong/supacloud-1/commit/1c137db3fd3c7c88e8d20e94e00327d29c7baf17))
* **management-api:** migrate legacy task authorities safely ([#1164](https://github.com/zuohuadong/supacloud-1/issues/1164)) ([b21ae05](https://github.com/zuohuadong/supacloud-1/commit/b21ae05bee4a2df9990c3dbc012f77ffd0cbbd3f))
* **management-api:** preserve application ACLs during runtime maintenance ([#1218](https://github.com/zuohuadong/supacloud-1/issues/1218)) ([c60eb45](https://github.com/zuohuadong/supacloud-1/commit/c60eb452f0e9ad713a74f9f2f95ee88a5310ce22))
* **management-api:** reconcile pg_graphql project entrypoint atomically ([#1234](https://github.com/zuohuadong/supacloud-1/issues/1234)) ([4b6ba7d](https://github.com/zuohuadong/supacloud-1/commit/4b6ba7d1e1b6eb8d836d4ff3c95cb221f2d9db32))
* **management-api:** release scheduled function response bodies ([#1364](https://github.com/zuohuadong/supacloud-1/issues/1364)) ([5c532e0](https://github.com/zuohuadong/supacloud-1/commit/5c532e09ec34cd11172f6180233ab94dd315efa5))
* **management-api:** restore platform bootstrap and schema-qualified audit markers ([#1454](https://github.com/zuohuadong/supacloud-1/issues/1454)) ([6655e19](https://github.com/zuohuadong/supacloud-1/commit/6655e19a348e1e5ce3006122de464a6aaf521c51))
* **management:** preserve mutation transactions during host operations ([#1508](https://github.com/zuohuadong/supacloud-1/issues/1508)) ([ebf79ac](https://github.com/zuohuadong/supacloud-1/commit/ebf79ac8b159007325c9837fb576d84db3f62fce))
* pin npm registry for reproducible installs in remaining packages ([#1414](https://github.com/zuohuadong/supacloud-1/issues/1414)) ([8110f3c](https://github.com/zuohuadong/supacloud-1/commit/8110f3c889ac48bc8e4cee35eb37ce7406d35587))
* preserve reviewed watchdog webhook deadlines and failure isolation ([#1567](https://github.com/zuohuadong/supacloud-1/issues/1567)) ([001180c](https://github.com/zuohuadong/supacloud-1/commit/001180cd2e010a2e481f378dac2dbf135b517e3c))
* report edge-function artifacts that fall back to separate copies ([#1564](https://github.com/zuohuadong/supacloud-1/issues/1564)) ([d6859e3](https://github.com/zuohuadong/supacloud-1/commit/d6859e316aea1e682262ab99bb3958f15838dcc5))
* **storage:** allow project service role to transform metadata-free objects ([#1483](https://github.com/zuohuadong/supacloud-1/issues/1483)) ([9bd5853](https://github.com/zuohuadong/supacloud-1/commit/9bd585373d2c9dc5c2466cc44b470696fcac0536))
* **storage:** source image transforms via the storage driver ([#1479](https://github.com/zuohuadong/supacloud-1/issues/1479)) ([1935b87](https://github.com/zuohuadong/supacloud-1/commit/1935b87d82d673bf1e57167b33c4f9306bfc0d2d))
* **storage:** verify project service auth for image transforms ([#1498](https://github.com/zuohuadong/supacloud-1/issues/1498)) ([d6402ab](https://github.com/zuohuadong/supacloud-1/commit/d6402abcf5df75ab405f6db6708da17888e5a91f))
* **systemd:** make pgredis-runtime patroni dependency weak ([#1426](https://github.com/zuohuadong/supacloud-1/issues/1426)) ([f87091e](https://github.com/zuohuadong/supacloud-1/commit/f87091e133bd11a4718c0c93813f75d9710b8f8a))
* **upgrade:** scale edge workers with cpu capacity ([#1644](https://github.com/zuohuadong/supacloud-1/issues/1644)) ([8d97de6](https://github.com/zuohuadong/supacloud-1/commit/8d97de61999a1cf54e844b32851838013c29e66a))
* **web-console:** enforce typed auth URL configuration contract ([#1663](https://github.com/zuohuadong/supacloud-1/issues/1663)) ([958efa9](https://github.com/zuohuadong/supacloud-1/commit/958efa9a87fdb143578343a8946b1e5e4d248d71))
* **worker:** enforce safe retirement and admission grants ([6ac69dc](https://github.com/zuohuadong/supacloud-1/commit/6ac69dcb3381c47a5f91737b958f3a730f4304f9))
* **worker:** restore admission compatibility after runtime merge ([#1625](https://github.com/zuohuadong/supacloud-1/issues/1625)) ([8e75778](https://github.com/zuohuadong/supacloud-1/commit/8e75778e543279ceefa21d97a35105274d72e700))


### Elegance & Refactoring

* use ESM-only owned packages and Lite launcher ([#1582](https://github.com/zuohuadong/supacloud-1/issues/1582)) ([ed5ac78](https://github.com/zuohuadong/supacloud-1/commit/ed5ac78ee3ab22567268fa276e5b016ad1e8b575))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1166](https://github.com/zuohuadong/supacloud-1/issues/1166)) ([2cb6deb](https://github.com/zuohuadong/supacloud-1/commit/2cb6deb1d27c78973eb6a3479b851b98073bc2ba))
* release main ([#1169](https://github.com/zuohuadong/supacloud-1/issues/1169)) ([3efc216](https://github.com/zuohuadong/supacloud-1/commit/3efc2167d5f50a2c566af60a877e896f979bf93f))
* release main ([#1181](https://github.com/zuohuadong/supacloud-1/issues/1181)) ([7258975](https://github.com/zuohuadong/supacloud-1/commit/7258975af0bd09019512d1d66e6826da16d8bbe4))
* release main ([#1186](https://github.com/zuohuadong/supacloud-1/issues/1186)) ([10db533](https://github.com/zuohuadong/supacloud-1/commit/10db533b1833a12880852a69ae0611e8cb5beb37))
* release main ([#1211](https://github.com/zuohuadong/supacloud-1/issues/1211)) ([5b06eda](https://github.com/zuohuadong/supacloud-1/commit/5b06eda20f637c121f177880291f6ee997cd01a1))
* release main ([#1214](https://github.com/zuohuadong/supacloud-1/issues/1214)) ([645b23e](https://github.com/zuohuadong/supacloud-1/commit/645b23e7801338e099733e715cd50c2113fb32a0))
* release main ([#1219](https://github.com/zuohuadong/supacloud-1/issues/1219)) ([3bfbe4b](https://github.com/zuohuadong/supacloud-1/commit/3bfbe4bd665a94166a201abc1131bc099df8fa8d))
* release main ([#1235](https://github.com/zuohuadong/supacloud-1/issues/1235)) ([bf00a8f](https://github.com/zuohuadong/supacloud-1/commit/bf00a8f0a240d20dbd79a3cda1f8e7fca76b16c0))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1275](https://github.com/zuohuadong/supacloud-1/issues/1275)) ([74f8b25](https://github.com/zuohuadong/supacloud-1/commit/74f8b2592900679c8d25fa9bccd4a6b90f37ae39))
* release main ([#1296](https://github.com/zuohuadong/supacloud-1/issues/1296)) ([1cb6cb3](https://github.com/zuohuadong/supacloud-1/commit/1cb6cb302064ecedba544886314dbf31d4494d91))
* release main ([#1303](https://github.com/zuohuadong/supacloud-1/issues/1303)) ([7cf5889](https://github.com/zuohuadong/supacloud-1/commit/7cf588922e5081926e34ae8b2438634e0ea16c2a))
* release main ([#1330](https://github.com/zuohuadong/supacloud-1/issues/1330)) ([95384f8](https://github.com/zuohuadong/supacloud-1/commit/95384f8db80b2706b30953f26944cc681f810543))
* release main ([#1357](https://github.com/zuohuadong/supacloud-1/issues/1357)) ([ee539ea](https://github.com/zuohuadong/supacloud-1/commit/ee539ea8f9390166047ed9404e935a4056de1141))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1405](https://github.com/zuohuadong/supacloud-1/issues/1405)) ([e840527](https://github.com/zuohuadong/supacloud-1/commit/e84052759dbbdec76718af0d2a6f1804f291bdb4))
* release main ([#1410](https://github.com/zuohuadong/supacloud-1/issues/1410)) ([fffefe4](https://github.com/zuohuadong/supacloud-1/commit/fffefe4a4555d3b9f4dabff3b580c555f096fde8))
* release main ([#1413](https://github.com/zuohuadong/supacloud-1/issues/1413)) ([0b0f637](https://github.com/zuohuadong/supacloud-1/commit/0b0f637b9eed202f8aa64a3d67ad6469b468bdb9))
* release main ([#1427](https://github.com/zuohuadong/supacloud-1/issues/1427)) ([50300fc](https://github.com/zuohuadong/supacloud-1/commit/50300fcb103081deb3eb3a08a76d38e379f5dac3))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1457](https://github.com/zuohuadong/supacloud-1/issues/1457)) ([6c87610](https://github.com/zuohuadong/supacloud-1/commit/6c87610a6161feef2d8bebff93e1d8a6bc08a45e))
* release main ([#1461](https://github.com/zuohuadong/supacloud-1/issues/1461)) ([17c4d2f](https://github.com/zuohuadong/supacloud-1/commit/17c4d2f7aef6198655224710bef3337c97caaada))
* release main ([#1474](https://github.com/zuohuadong/supacloud-1/issues/1474)) ([6255eb7](https://github.com/zuohuadong/supacloud-1/commit/6255eb7e7eefc4ee5cd06bef05d4c81a29be706a))
* release main ([#1482](https://github.com/zuohuadong/supacloud-1/issues/1482)) ([ef782af](https://github.com/zuohuadong/supacloud-1/commit/ef782afd7e281601c1444573b161c210497492e5))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1492](https://github.com/zuohuadong/supacloud-1/issues/1492)) ([eb37eeb](https://github.com/zuohuadong/supacloud-1/commit/eb37eeb972a299f54edb356b1959800c16e6d511))
* release main ([#1495](https://github.com/zuohuadong/supacloud-1/issues/1495)) ([ced66da](https://github.com/zuohuadong/supacloud-1/commit/ced66dab53493e875c58f904ef0b3c26a8810928))
* release main ([#1500](https://github.com/zuohuadong/supacloud-1/issues/1500)) ([7d9368a](https://github.com/zuohuadong/supacloud-1/commit/7d9368a946f1d400aca11c54c3081dc8e88d8e82))
* release main ([#1507](https://github.com/zuohuadong/supacloud-1/issues/1507)) ([b7f3a59](https://github.com/zuohuadong/supacloud-1/commit/b7f3a59885596742a8b11fc808d898165a8989ec))
* release main ([#1550](https://github.com/zuohuadong/supacloud-1/issues/1550)) ([06b5266](https://github.com/zuohuadong/supacloud-1/commit/06b52667d9c23ea92053a36b0251cf93624c1014))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1617](https://github.com/zuohuadong/supacloud-1/issues/1617)) ([afad389](https://github.com/zuohuadong/supacloud-1/commit/afad38960cf086afeddcdc4565daa7b8cb429c2e))
* release main ([#1623](https://github.com/zuohuadong/supacloud-1/issues/1623)) ([f68e24d](https://github.com/zuohuadong/supacloud-1/commit/f68e24d942ddb71342eb80bef1c78015b4c2b079))
* release main ([#1629](https://github.com/zuohuadong/supacloud-1/issues/1629)) ([d71addd](https://github.com/zuohuadong/supacloud-1/commit/d71addd0e974b70505be4702e9e6d02d90e9fabc))
* release main ([#1633](https://github.com/zuohuadong/supacloud-1/issues/1633)) ([e9db823](https://github.com/zuohuadong/supacloud-1/commit/e9db823b47db6b0d9ebe8057792e35e34c144420))
* release main ([#1647](https://github.com/zuohuadong/supacloud-1/issues/1647)) ([9afdb5c](https://github.com/zuohuadong/supacloud-1/commit/9afdb5c348a2e87169e8898b3842091bb8f1ddea))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1661](https://github.com/zuohuadong/supacloud-1/issues/1661)) ([77ea3fa](https://github.com/zuohuadong/supacloud-1/commit/77ea3fa73707222f21561005a6be3569dae606b4))
* release main ([#1664](https://github.com/zuohuadong/supacloud-1/issues/1664)) ([9827aa5](https://github.com/zuohuadong/supacloud-1/commit/9827aa53b418a91a41e81bc02c50f05d09e03d4c))
</details>

<details><summary>web-console: 0.50.0</summary>

## [0.50.0](https://github.com/zuohuadong/supacloud-1/compare/web-console-v0.49.2...web-console-v0.50.0) (2026-10-31)


### Features

* add agent backend authoring, runtime and observability workflows ([#1648](https://github.com/zuohuadong/supacloud-1/issues/1648)) ([59a66d1](https://github.com/zuohuadong/supacloud-1/commit/59a66d184a47d19c7f8895f24a6ba2c7e74e93d0))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **auth:** add project OAuth Server console and GoTrue admin proxy ([#1293](https://github.com/zuohuadong/supacloud-1/issues/1293)) ([2cbc565](https://github.com/zuohuadong/supacloud-1/commit/2cbc5657ee59d173869cbf36d979b14babd81e56))
* **console:** add read-only application dashboard ([#1493](https://github.com/zuohuadong/supacloud-1/issues/1493)) ([38bf51a](https://github.com/zuohuadong/supacloud-1/commit/38bf51a6424ed5c5cc45361e4d89e77be31eb927))
* **console:** safely inspect delivered application development context ([#1522](https://github.com/zuohuadong/supacloud-1/issues/1522)) ([db25fc2](https://github.com/zuohuadong/supacloud-1/commit/db25fc2844a18aea660e5fdd5249486f40ec1458))
* establish single-node delivery baseline ([#1632](https://github.com/zuohuadong/supacloud-1/issues/1632)) ([926de6c](https://github.com/zuohuadong/supacloud-1/commit/926de6c6c72940f7c03e046908ef446c54d37621))
* **extensions:** manage canonical pgflow installation and pause state ([#1331](https://github.com/zuohuadong/supacloud-1/issues/1331)) ([aa666eb](https://github.com/zuohuadong/supacloud-1/commit/aa666eb48130508f39a41523d8aeefdf25912e9a))
* **graphql:** add compatibility governance pack ([24c58dc](https://github.com/zuohuadong/supacloud-1/commit/24c58dcc2a5ae94e15065297be38d37d0941ed43))
* **hosting:** add frontend hosting environments, versions, and console ([#1292](https://github.com/zuohuadong/supacloud-1/issues/1292)) ([4a5dc78](https://github.com/zuohuadong/supacloud-1/commit/4a5dc78cbb827ff22e5b714c3311c377db44ea67))
* **management-api:** validate the project dashboard summary route ([f1e7bc1](https://github.com/zuohuadong/supacloud-1/commit/f1e7bc14911d2a97dd9ac17414bc681e68bfa991))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **platform:** connect deployment evidence to console and mcp ([f86af1c](https://github.com/zuohuadong/supacloud-1/commit/f86af1c4be4346452cdc580f51ced7a38555d0dc))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))
* **web-console:** add validated project data-layer contracts ([#1381](https://github.com/zuohuadong/supacloud-1/issues/1381)) ([4da077e](https://github.com/zuohuadong/supacloud-1/commit/4da077e0107101bc49b30304c3fe7e3b58c86ce4))
* **web-console:** drive JWT settings through a validated contract ([#1392](https://github.com/zuohuadong/supacloud-1/issues/1392)) ([272d637](https://github.com/zuohuadong/supacloud-1/commit/272d6372c3b8085846da2c4cbac2c97f798e24a3))
* **web-console:** drive project pooling through the validated state API ([2316899](https://github.com/zuohuadong/supacloud-1/commit/23168990d8a8c0820a84acdae83804449b2210d9))
* **web-console:** drive service controls through the validated contract ([085efd8](https://github.com/zuohuadong/supacloud-1/commit/085efd8780a44b0a14fc583ef013499a7ed66576))
* **web-console:** harden auth settings boundaries ([a2987bd](https://github.com/zuohuadong/supacloud-1/commit/a2987bd50ef0885b4b034aeb4a57b0ce4a913817))
* **web-console:** persist SQL editor drafts and typed table forms ([#1294](https://github.com/zuohuadong/supacloud-1/issues/1294)) ([1eadf8b](https://github.com/zuohuadong/supacloud-1/commit/1eadf8b2001506d02d4d978ee223168705a60a90))
* **web-console:** preserve typed svadmin resource reads ([#1656](https://github.com/zuohuadong/supacloud-1/issues/1656)) ([2d83827](https://github.com/zuohuadong/supacloud-1/commit/2d8382736a4d877d52e0d03705819bc952bf3a0c))
* **web-console:** productize durable webhook delivery ([9288fc0](https://github.com/zuohuadong/supacloud-1/commit/9288fc064a37176363e7d2f370ec658ed73e4e40))
* **web-console:** rebuild the project overview on validated contracts ([f28428a](https://github.com/zuohuadong/supacloud-1/commit/f28428ad9d2ec55d0c742f2fe539f1bc769e2fab))
* **web-console:** rebuild the task center on validated contracts ([#1391](https://github.com/zuohuadong/supacloud-1/issues/1391)) ([c4d2b8f](https://github.com/zuohuadong/supacloud-1/commit/c4d2b8f0f076ed8c1dc3d3ed6d22c1532c6ae66a))
* **web-console:** upgrade svadmin and type auth mutations ([#1662](https://github.com/zuohuadong/supacloud-1/issues/1662)) ([b7bc46c](https://github.com/zuohuadong/supacloud-1/commit/b7bc46cb3aeb57decd9265699cc66a6dd8c0d4ea))
* **web-console:** upgrade SVAdmin dependencies and Tailwind v4 theme styles ([#1191](https://github.com/zuohuadong/supacloud-1/issues/1191)) ([67fa640](https://github.com/zuohuadong/supacloud-1/commit/67fa640ccc617c7131f49132a92b346151aeb711))
* **web-console:** wire dashboard and project routes to validated contracts ([#1384](https://github.com/zuohuadong/supacloud-1/issues/1384)) ([15f5913](https://github.com/zuohuadong/supacloud-1/commit/15f5913516ca128dac03177533072bd1b7f5eb3d))


### Bug Fixes

* **compiler:** align migration dependency pin with released elysia 0.15.0 ([#1324](https://github.com/zuohuadong/supacloud-1/issues/1324)) ([459ee84](https://github.com/zuohuadong/supacloud-1/commit/459ee840ade78b7f5891a678ef8ccbdd29631a30))
* **deps,perf:** replace Bun native APIs and resolve audit vulnerabilities ([#1667](https://github.com/zuohuadong/supacloud-1/issues/1667)) ([06a9199](https://github.com/zuohuadong/supacloud-1/commit/06a91990c754ce586f2a2353f253dc50f4fa0f98))
* **web-console:** enforce typed auth URL configuration contract ([#1663](https://github.com/zuohuadong/supacloud-1/issues/1663)) ([958efa9](https://github.com/zuohuadong/supacloud-1/commit/958efa9a87fdb143578343a8946b1e5e4d248d71))
* **web-console:** isolate table rows from the active project context ([f2ecdaf](https://github.com/zuohuadong/supacloud-1/commit/f2ecdaf73086d4b4dba1f8e1a6bfaf7d6f220863))


### Performance Improvements

* **compiler,web-console:** optimize I/O with Bun APIs, Vite pre-bundling, and graph algorithms ([#1246](https://github.com/zuohuadong/supacloud-1/issues/1246)) ([1db9458](https://github.com/zuohuadong/supacloud-1/commit/1db9458bb620c32476597c5bf795d00e63700559))


### Documentation

* **web-console:** clarify svadmin package provenance ([#1319](https://github.com/zuohuadong/supacloud-1/issues/1319)) ([d0e4379](https://github.com/zuohuadong/supacloud-1/commit/d0e437960fef8021d967947290e59a392d42df68))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** patch high-severity audit advisories in web-console ([#1521](https://github.com/zuohuadong/supacloud-1/issues/1521)) ([1be1ece](https://github.com/zuohuadong/supacloud-1/commit/1be1ece3f4fa150508e4f54c6dc9d84a7868057f))
* **deps:** upgrade SVAdmin packages to npm latest ([#1295](https://github.com/zuohuadong/supacloud-1/issues/1295)) ([6c9a406](https://github.com/zuohuadong/supacloud-1/commit/6c9a4063d6d05b6bf57d63d5a03b134c95174ec0))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1192](https://github.com/zuohuadong/supacloud-1/issues/1192)) ([1e505e1](https://github.com/zuohuadong/supacloud-1/commit/1e505e1713c918c07596110c2078cb88bdc5e9bd))
* release main ([#1247](https://github.com/zuohuadong/supacloud-1/issues/1247)) ([b21ffe3](https://github.com/zuohuadong/supacloud-1/commit/b21ffe3dfec4d8513dfcb1ff59092b4f89ff344f))
* release main ([#1296](https://github.com/zuohuadong/supacloud-1/issues/1296)) ([1cb6cb3](https://github.com/zuohuadong/supacloud-1/commit/1cb6cb302064ecedba544886314dbf31d4494d91))
* release main ([#1320](https://github.com/zuohuadong/supacloud-1/issues/1320)) ([cc7a100](https://github.com/zuohuadong/supacloud-1/commit/cc7a100f892da8e4981161d05e3be46ddbef2aa8))
* release main ([#1330](https://github.com/zuohuadong/supacloud-1/issues/1330)) ([95384f8](https://github.com/zuohuadong/supacloud-1/commit/95384f8db80b2706b30953f26944cc681f810543))
* release main ([#1359](https://github.com/zuohuadong/supacloud-1/issues/1359)) ([750b0b2](https://github.com/zuohuadong/supacloud-1/commit/750b0b279f07f62b033b4bf4f1e7c99a6d03fc4c))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1403](https://github.com/zuohuadong/supacloud-1/issues/1403)) ([a889f07](https://github.com/zuohuadong/supacloud-1/commit/a889f07bb1ec13744b17a5f0cc4be3aa98f5e179))
* release main ([#1450](https://github.com/zuohuadong/supacloud-1/issues/1450)) ([662afde](https://github.com/zuohuadong/supacloud-1/commit/662afde422456e17a0a53a56e976294ffdcf4804))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1495](https://github.com/zuohuadong/supacloud-1/issues/1495)) ([ced66da](https://github.com/zuohuadong/supacloud-1/commit/ced66dab53493e875c58f904ef0b3c26a8810928))
* release main ([#1507](https://github.com/zuohuadong/supacloud-1/issues/1507)) ([b7f3a59](https://github.com/zuohuadong/supacloud-1/commit/b7f3a59885596742a8b11fc808d898165a8989ec))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1592](https://github.com/zuohuadong/supacloud-1/issues/1592)) ([224f76d](https://github.com/zuohuadong/supacloud-1/commit/224f76dfff188cf943152c3ee23cff2269d4d2b9))
* release main ([#1633](https://github.com/zuohuadong/supacloud-1/issues/1633)) ([e9db823](https://github.com/zuohuadong/supacloud-1/commit/e9db823b47db6b0d9ebe8057792e35e34c144420))
* release main ([#1647](https://github.com/zuohuadong/supacloud-1/issues/1647)) ([9afdb5c](https://github.com/zuohuadong/supacloud-1/commit/9afdb5c348a2e87169e8898b3842091bb8f1ddea))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1661](https://github.com/zuohuadong/supacloud-1/issues/1661)) ([77ea3fa](https://github.com/zuohuadong/supacloud-1/commit/77ea3fa73707222f21561005a6be3569dae606b4))
* release main ([#1664](https://github.com/zuohuadong/supacloud-1/issues/1664)) ([9827aa5](https://github.com/zuohuadong/supacloud-1/commit/9827aa53b418a91a41e81bc02c50f05d09e03d4c))
* release main ([#1668](https://github.com/zuohuadong/supacloud-1/issues/1668)) ([a7ce18b](https://github.com/zuohuadong/supacloud-1/commit/a7ce18b73e0a2e93df664fb8da08cd40f3bdae82))
* **web-console:** upgrade svadmin and adopt product page primitives ([7043a6d](https://github.com/zuohuadong/supacloud-1/commit/7043a6ddcedecd9ca9112122f65726b93d93af88))
* **web-console:** upgrade svadmin packages ([#1449](https://github.com/zuohuadong/supacloud-1/issues/1449)) ([cf6334c](https://github.com/zuohuadong/supacloud-1/commit/cf6334cb4a913b60f8feae3eb726d033a8c67c1b))
* **web-console:** upgrade SVAdmin packages to 0.75 ([2ef0f8d](https://github.com/zuohuadong/supacloud-1/commit/2ef0f8db9005be2a140e9aa20750af53cab9bb2b))
* **web-console:** upgrade SVAdmin to latest and migrate contracts ([#1358](https://github.com/zuohuadong/supacloud-1/issues/1358)) ([efbfb8a](https://github.com/zuohuadong/supacloud-1/commit/efbfb8a5cd30dfa8f380be89132f7b623b1055f4))
* **web-console:** upgrade svadmin ui to 0.81.0 ([#1589](https://github.com/zuohuadong/supacloud-1/issues/1589)) ([49498d3](https://github.com/zuohuadong/supacloud-1/commit/49498d3c713b8ef83cbf8224706155e0ebbe208d))
</details>

<details><summary>edge-runtime: 0.30.0</summary>

## [0.30.0](https://github.com/zuohuadong/supacloud-1/compare/edge-runtime-v0.29.1...edge-runtime-v0.30.0) (2026-10-31)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **cli:** support configurable upload body limits for edge functions and host install ([#1274](https://github.com/zuohuadong/supacloud-1/issues/1274)) ([5f9e85a](https://github.com/zuohuadong/supacloud-1/commit/5f9e85aa502e06e739fa9e6d43e2bcc1f94d721a))
* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/zuohuadong/supacloud-1/issues/1654)) ([39ee49f](https://github.com/zuohuadong/supacloud-1/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))
* **functions:** publish atomic project release manifests ([#1215](https://github.com/zuohuadong/supacloud-1/issues/1215)) ([e4c582f](https://github.com/zuohuadong/supacloud-1/commit/e4c582f55a88e47cf4795cfe8e42b8672791dce8))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **observability:** trace request and background function execution ([#1212](https://github.com/zuohuadong/supacloud-1/issues/1212)) ([589b1e8](https://github.com/zuohuadong/supacloud-1/commit/589b1e8ac07ea9e91f4a486221a90bf952b2d92d))
* **pgredis:** add batch mget/mset cache operations ([#1417](https://github.com/zuohuadong/supacloud-1/issues/1417)) ([ce57b21](https://github.com/zuohuadong/supacloud-1/commit/ce57b21089d29d49653f9f949aa54ad784843707))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))


### Bug Fixes

* **edge-runtime:** avoid recycling on idle memory plateau ([#1520](https://github.com/zuohuadong/supacloud-1/issues/1520)) ([1241ee8](https://github.com/zuohuadong/supacloud-1/commit/1241ee83ad1b6f411713a3c00923fdcb3c79de58))
* **edge-runtime:** honor configured upload limit in HTTP listener ([#1273](https://github.com/zuohuadong/supacloud-1/issues/1273)) ([cbd1131](https://github.com/zuohuadong/supacloud-1/commit/cbd11311471ac31c8aa605f00ac5b503c3d60160))
* **edge-runtime:** preserve guarded constructor identity ([#1680](https://github.com/zuohuadong/supacloud-1/issues/1680)) ([2bae9a1](https://github.com/zuohuadong/supacloud-1/commit/2bae9a12dd276bd2d4822e7fb2f978374a2e40d0))
* **edge-runtime:** recover from sustained memory pressure ([#1362](https://github.com/zuohuadong/supacloud-1/issues/1362)) ([3176007](https://github.com/zuohuadong/supacloud-1/commit/31760071f6e32031ffe1c18a1d6d04ac5fdf21c0))
* pin npm registry for reproducible installs in remaining packages ([#1414](https://github.com/zuohuadong/supacloud-1/issues/1414)) ([8110f3c](https://github.com/zuohuadong/supacloud-1/commit/8110f3c889ac48bc8e4cee35eb37ce7406d35587))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1214](https://github.com/zuohuadong/supacloud-1/issues/1214)) ([645b23e](https://github.com/zuohuadong/supacloud-1/commit/645b23e7801338e099733e715cd50c2113fb32a0))
* release main ([#1219](https://github.com/zuohuadong/supacloud-1/issues/1219)) ([3bfbe4b](https://github.com/zuohuadong/supacloud-1/commit/3bfbe4bd665a94166a201abc1131bc099df8fa8d))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1275](https://github.com/zuohuadong/supacloud-1/issues/1275)) ([74f8b25](https://github.com/zuohuadong/supacloud-1/commit/74f8b2592900679c8d25fa9bccd4a6b90f37ae39))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1413](https://github.com/zuohuadong/supacloud-1/issues/1413)) ([0b0f637](https://github.com/zuohuadong/supacloud-1/commit/0b0f637b9eed202f8aa64a3d67ad6469b468bdb9))
* release main ([#1418](https://github.com/zuohuadong/supacloud-1/issues/1418)) ([8338966](https://github.com/zuohuadong/supacloud-1/commit/83389661ceee07141c7dfad14a7ccd47f6940943))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1507](https://github.com/zuohuadong/supacloud-1/issues/1507)) ([b7f3a59](https://github.com/zuohuadong/supacloud-1/commit/b7f3a59885596742a8b11fc808d898165a8989ec))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1681](https://github.com/zuohuadong/supacloud-1/issues/1681)) ([c804f96](https://github.com/zuohuadong/supacloud-1/commit/c804f96c450e193f37f182f81002fd5ff65dfe68))
</details>

<details><summary>pgredis-runtime: 0.13.0</summary>

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
</details>

<details><summary>supacloud-lite: 0.22.0</summary>

## [0.22.0](https://github.com/zuohuadong/supacloud-1/compare/supacloud-lite-v0.21.1...supacloud-lite-v0.22.0) (2026-10-31)


###   BREAKING CHANGES

* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* add agent backend authoring, runtime and observability workflows ([#1648](https://github.com/zuohuadong/supacloud-1/issues/1648)) ([59a66d1](https://github.com/zuohuadong/supacloud-1/commit/59a66d184a47d19c7f8895f24a6ba2c7e74e93d0))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **auth:** add project OAuth Server console and GoTrue admin proxy ([#1293](https://github.com/zuohuadong/supacloud-1/issues/1293)) ([2cbc565](https://github.com/zuohuadong/supacloud-1/commit/2cbc5657ee59d173869cbf36d979b14babd81e56))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* converge SDK-aware vibecoding defaults and local development ([#1607](https://github.com/zuohuadong/supacloud-1/issues/1607)) ([cd66672](https://github.com/zuohuadong/supacloud-1/commit/cd6667252a6a8fe0cc0539bc8610ebb8a818af51))
* default RxJS support with compatible SupaCloud JS calls ([#1556](https://github.com/zuohuadong/supacloud-1/issues/1556)) ([b3015cb](https://github.com/zuohuadong/supacloud-1/commit/b3015cb161c0d87e6611f6c4fc60c120a8c9fffe))
* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/zuohuadong/supacloud-1/issues/1654)) ([39ee49f](https://github.com/zuohuadong/supacloud-1/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))
* **graphql:** add compatibility governance pack ([24c58dc](https://github.com/zuohuadong/supacloud-1/commit/24c58dcc2a5ae94e15065297be38d37d0941ed43))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* **lite:** align runtime contracts and support real pg_graphql ([#1231](https://github.com/zuohuadong/supacloud-1/issues/1231)) ([9dec0ce](https://github.com/zuohuadong/supacloud-1/commit/9dec0ceca8f0457cd8f514506c4660b5148226b3))
* **lite:** bundle PostgreSQL extension parity set ([736dc96](https://github.com/zuohuadong/supacloud-1/commit/736dc9677ae58ce8e35aa22603e5222843076a06))
* **management-api:** add PGMQ queue settings, batch ingestion, and queue governance ([#1291](https://github.com/zuohuadong/supacloud-1/issues/1291)) ([8362642](https://github.com/zuohuadong/supacloud-1/commit/8362642267c18f92beee2e3f5833eef3945651a0))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))
* **supacloud-js:** add durable workflow, command, artifact, and queue RPC client ([#1290](https://github.com/zuohuadong/supacloud-1/issues/1290)) ([0183c74](https://github.com/zuohuadong/supacloud-1/commit/0183c7441988902fcad98b25bd80b8cb15d254de))
* **worker:** add Graphile-style PGMQ job controls ([d1f9832](https://github.com/zuohuadong/supacloud-1/commit/d1f9832306582d361dd6005fae79c362b8a5d0ae))


### Bug Fixes

* **deps,perf:** replace Bun native APIs and resolve audit vulnerabilities ([#1667](https://github.com/zuohuadong/supacloud-1/issues/1667)) ([06a9199](https://github.com/zuohuadong/supacloud-1/commit/06a91990c754ce586f2a2353f253dc50f4fa0f98))
* pin Elysia 2 beta compatibility boundary ([#1467](https://github.com/zuohuadong/supacloud-1/issues/1467)) ([bdb2a2e](https://github.com/zuohuadong/supacloud-1/commit/bdb2a2e658cae4160f2a774b5c459d1a2d8fb601))
* **release:** retry npm view after a just-published sibling ([a9576cd](https://github.com/zuohuadong/supacloud-1/commit/a9576cd8b76cf99ebb73bada7bbcb3351148099c))


### Elegance & Refactoring

* use ESM-only owned packages and Lite launcher ([#1582](https://github.com/zuohuadong/supacloud-1/issues/1582)) ([ed5ac78](https://github.com/zuohuadong/supacloud-1/commit/ed5ac78ee3ab22567268fa276e5b016ad1e8b575))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1239](https://github.com/zuohuadong/supacloud-1/issues/1239)) ([edd8bc5](https://github.com/zuohuadong/supacloud-1/commit/edd8bc55ed26bb0dbf94b5cef9c88bdf26eb8216))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1296](https://github.com/zuohuadong/supacloud-1/issues/1296)) ([1cb6cb3](https://github.com/zuohuadong/supacloud-1/commit/1cb6cb302064ecedba544886314dbf31d4494d91))
* release main ([#1310](https://github.com/zuohuadong/supacloud-1/issues/1310)) ([134b716](https://github.com/zuohuadong/supacloud-1/commit/134b716b357a5bb257b91e2ef78d689773f75f9d))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1474](https://github.com/zuohuadong/supacloud-1/issues/1474)) ([6255eb7](https://github.com/zuohuadong/supacloud-1/commit/6255eb7e7eefc4ee5cd06bef05d4c81a29be706a))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1609](https://github.com/zuohuadong/supacloud-1/issues/1609)) ([b52c79c](https://github.com/zuohuadong/supacloud-1/commit/b52c79ceda912786f1299ae2d618172f9252607a))
* release main ([#1647](https://github.com/zuohuadong/supacloud-1/issues/1647)) ([9afdb5c](https://github.com/zuohuadong/supacloud-1/commit/9afdb5c348a2e87169e8898b3842091bb8f1ddea))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1668](https://github.com/zuohuadong/supacloud-1/issues/1668)) ([a7ce18b](https://github.com/zuohuadong/supacloud-1/commit/a7ce18b73e0a2e93df664fb8da08cd40f3bdae82))
* unify project licensing under Apache-2.0 ([#1566](https://github.com/zuohuadong/supacloud-1/issues/1566)) ([36dd377](https://github.com/zuohuadong/supacloud-1/commit/36dd37796147a5e7051534d6d9535f13ad881a93))
</details>

<details><summary>query: 0.3.0</summary>

## [0.3.0](https://github.com/zuohuadong/supacloud-1/compare/query-v0.2.0...query-v0.3.0) (2026-10-31)


### Features

* **compiler,query,supacloud-js:** procedure façade, supabase-js compatibility, and @supacloud/query adapter ([#1653](https://github.com/zuohuadong/supacloud-1/issues/1653)) ([8ed8d1a](https://github.com/zuohuadong/supacloud-1/commit/8ed8d1ad594ab981e6d03333ad35248608467992))


### Miscellaneous Chores

* release main ([#1661](https://github.com/zuohuadong/supacloud-1/issues/1661)) ([77ea3fa](https://github.com/zuohuadong/supacloud-1/commit/77ea3fa73707222f21561005a6be3569dae606b4))
</details>

<details><summary>supacloud-js: 0.41.0</summary>

## [0.41.0](https://github.com/zuohuadong/supacloud-1/compare/supacloud-js-v0.40.0...supacloud-js-v0.41.0) (2026-10-31)


###   BREAKING CHANGES

* **js:** @supacloud/js explicitly declares Node >=22.12.0. Synchronous require compatibility uses Node's ESM loader and does not promise older Node, classic CJS-only tooling or React Native/Hermes compatibility. Existing ESM specifiers and synchronous factory/Promise-based network APIs are unchanged.
* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* add Supabase-compatible procedure client transport ([#1634](https://github.com/zuohuadong/supacloud-1/issues/1634)) ([661351a](https://github.com/zuohuadong/supacloud-1/commit/661351ae507877a463a5aab1bd49a27c9bd77cfa))
* adopt Pigsty Silo MinIO fork, expose environment/version APIs, and storage upload constraints ([#1279](https://github.com/zuohuadong/supacloud-1/issues/1279)) ([e47b25b](https://github.com/zuohuadong/supacloud-1/commit/e47b25bdc61935e901f0e98b7eb2a84dcf221e89))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* **compiler,query,supacloud-js:** procedure façade, supabase-js compatibility, and @supacloud/query adapter ([#1653](https://github.com/zuohuadong/supacloud-1/issues/1653)) ([8ed8d1a](https://github.com/zuohuadong/supacloud-1/commit/8ed8d1ad594ab981e6d03333ad35248608467992))
* default RxJS support with compatible SupaCloud JS calls ([#1556](https://github.com/zuohuadong/supacloud-1/issues/1556)) ([b3015cb](https://github.com/zuohuadong/supacloud-1/commit/b3015cb161c0d87e6611f6c4fc60c120a8c9fffe))
* expose application task links for background execution ([#1406](https://github.com/zuohuadong/supacloud-1/issues/1406)) ([24995b1](https://github.com/zuohuadong/supacloud-1/commit/24995b169cfe81888bb187c8f2e6f0775e816d62))
* **framework:** add OpenAPI generation and typed worker execution ([#1286](https://github.com/zuohuadong/supacloud-1/issues/1286)) ([25dcffb](https://github.com/zuohuadong/supacloud-1/commit/25dcffb9a7a33ee7205868c860126d3d2ef50ff4))
* freeze authored type-safety merge gate ([25e07ea](https://github.com/zuohuadong/supacloud-1/commit/25e07ea1de16cc01a24ed6f001b9bdc729b5ee5e))
* **js:** publish SDK and Contracts as dual MJS and CJS ([#1585](https://github.com/zuohuadong/supacloud-1/issues/1585)) ([6183f3e](https://github.com/zuohuadong/supacloud-1/commit/6183f3e7e985f1fb06a6b31aaf2bab125bb1b34d))
* **js:** support modern CommonJS callers with a single ESM SDK ([#1584](https://github.com/zuohuadong/supacloud-1/issues/1584)) ([cfb6f20](https://github.com/zuohuadong/supacloud-1/commit/cfb6f20d77a1befa6e62ea90a591d373c1677307))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **sdk:** support capabilities probing and storage upload constraints in supacloud-js ([#1277](https://github.com/zuohuadong/supacloud-1/issues/1277)) ([c4eda8a](https://github.com/zuohuadong/supacloud-1/commit/c4eda8a105535c37da09bb03f19ddee616257c47))
* **supacloud-js:** add durable workflow, command, artifact, and queue RPC client ([#1290](https://github.com/zuohuadong/supacloud-1/issues/1290)) ([0183c74](https://github.com/zuohuadong/supacloud-1/commit/0183c7441988902fcad98b25bd80b8cb15d254de))
* **supacloud-js:** add framework-neutral TanStack Query adapter ([#1637](https://github.com/zuohuadong/supacloud-1/issues/1637)) ([071b28c](https://github.com/zuohuadong/supacloud-1/commit/071b28c5ce992834f46a0608d68475eb295c5c3e))
* **supacloud-js:** add typed procedure facade and unified errors ([#1639](https://github.com/zuohuadong/supacloud-1/issues/1639)) ([fef05e9](https://github.com/zuohuadong/supacloud-1/commit/fef05e98ee1044e1f449bad52d18104d28e17cb4))
* **supacloud-js:** expose browser contracts for svadmin integration ([#1428](https://github.com/zuohuadong/supacloud-1/issues/1428)) ([4e97880](https://github.com/zuohuadong/supacloud-1/commit/4e97880f5a82164a26326f0c48701401c964a41e))
* **tasks:** durable output replay, attempt fencing and quotas without gRPC ([#1356](https://github.com/zuohuadong/supacloud-1/issues/1356)) ([6866b80](https://github.com/zuohuadong/supacloud-1/commit/6866b808e99910ffe145788eb22f43bcf21b008e))
* **worker:** add Graphile-style PGMQ job controls ([d1f9832](https://github.com/zuohuadong/supacloud-1/commit/d1f9832306582d361dd6005fae79c362b8a5d0ae))
* **worker:** add tenant-scoped pgflow runtime and shared PG18 installation ([#1329](https://github.com/zuohuadong/supacloud-1/issues/1329)) ([5149870](https://github.com/zuohuadong/supacloud-1/commit/51498703d15b2f3a6e4ec72e01177013b31a3068))


### Bug Fixes

* **compiler:** compose generated clients with frontend SDK auth ([#1603](https://github.com/zuohuadong/supacloud-1/issues/1603)) ([7b14968](https://github.com/zuohuadong/supacloud-1/commit/7b1496828a9ade663f2a3d4572252af966296763))
* **supacloud-js:** harden procedure execution contracts ([#1643](https://github.com/zuohuadong/supacloud-1/issues/1643)) ([cb20731](https://github.com/zuohuadong/supacloud-1/commit/cb20731961525ee02e8d46467bf45e9b3dbd9147))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1249](https://github.com/zuohuadong/supacloud-1/issues/1249)) ([76c2d14](https://github.com/zuohuadong/supacloud-1/commit/76c2d14ab9127c4150909af778eb92e969f30e7a))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1275](https://github.com/zuohuadong/supacloud-1/issues/1275)) ([74f8b25](https://github.com/zuohuadong/supacloud-1/commit/74f8b2592900679c8d25fa9bccd4a6b90f37ae39))
* release main ([#1287](https://github.com/zuohuadong/supacloud-1/issues/1287)) ([99688d6](https://github.com/zuohuadong/supacloud-1/commit/99688d69245cb881d14e98d0cb38037b45c3a343))
* release main ([#1296](https://github.com/zuohuadong/supacloud-1/issues/1296)) ([1cb6cb3](https://github.com/zuohuadong/supacloud-1/commit/1cb6cb302064ecedba544886314dbf31d4494d91))
* release main ([#1330](https://github.com/zuohuadong/supacloud-1/issues/1330)) ([95384f8](https://github.com/zuohuadong/supacloud-1/commit/95384f8db80b2706b30953f26944cc681f810543))
* release main ([#1357](https://github.com/zuohuadong/supacloud-1/issues/1357)) ([ee539ea](https://github.com/zuohuadong/supacloud-1/commit/ee539ea8f9390166047ed9404e935a4056de1141))
* release main ([#1405](https://github.com/zuohuadong/supacloud-1/issues/1405)) ([e840527](https://github.com/zuohuadong/supacloud-1/commit/e84052759dbbdec76718af0d2a6f1804f291bdb4))
* release main ([#1429](https://github.com/zuohuadong/supacloud-1/issues/1429)) ([3fd804a](https://github.com/zuohuadong/supacloud-1/commit/3fd804aa90cd8b81604a5d2059cd900e06163483))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1586](https://github.com/zuohuadong/supacloud-1/issues/1586)) ([21f22d8](https://github.com/zuohuadong/supacloud-1/commit/21f22d8dba3a1e6e704865727ed5ff4095d28eac))
* release main ([#1600](https://github.com/zuohuadong/supacloud-1/issues/1600)) ([5209a75](https://github.com/zuohuadong/supacloud-1/commit/5209a7589b785d8243be24ad3ec25a0ccdb7b42c))
* release main ([#1633](https://github.com/zuohuadong/supacloud-1/issues/1633)) ([e9db823](https://github.com/zuohuadong/supacloud-1/commit/e9db823b47db6b0d9ebe8057792e35e34c144420))
* release main ([#1638](https://github.com/zuohuadong/supacloud-1/issues/1638)) ([1857d39](https://github.com/zuohuadong/supacloud-1/commit/1857d39b2639e5ddf8f0a671b4167ba9c2f15c39))
* release main ([#1642](https://github.com/zuohuadong/supacloud-1/issues/1642)) ([2c2de43](https://github.com/zuohuadong/supacloud-1/commit/2c2de431073a6097f7589bc8b2f413508aec82b4))
* release main ([#1647](https://github.com/zuohuadong/supacloud-1/issues/1647)) ([9afdb5c](https://github.com/zuohuadong/supacloud-1/commit/9afdb5c348a2e87169e8898b3842091bb8f1ddea))
* release main ([#1661](https://github.com/zuohuadong/supacloud-1/issues/1661)) ([77ea3fa](https://github.com/zuohuadong/supacloud-1/commit/77ea3fa73707222f21561005a6be3569dae606b4))
</details>

<details><summary>cli: 0.70.0</summary>

## [0.70.0](https://github.com/zuohuadong/supacloud-1/compare/cli-v0.69.1...cli-v0.70.0) (2026-10-31)


###   BREAKING CHANGES

* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.

### Features

* add agent backend authoring, runtime and observability workflows ([#1648](https://github.com/zuohuadong/supacloud-1/issues/1648)) ([59a66d1](https://github.com/zuohuadong/supacloud-1/commit/59a66d184a47d19c7f8895f24a6ba2c7e74e93d0))
* add SupAuth identity and FA-driven command governance ([#1220](https://github.com/zuohuadong/supacloud-1/issues/1220)) ([66a77ca](https://github.com/zuohuadong/supacloud-1/commit/66a77caea086bb1282772dd9401bd2adb9c04342))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **app:** provide zero-config project defaults ([#1173](https://github.com/zuohuadong/supacloud-1/issues/1173)) ([489824d](https://github.com/zuohuadong/supacloud-1/commit/489824db5137e4675248cfc789d9d86e8139775e))
* **architecture:** enforce compile-time application governance ([#1301](https://github.com/zuohuadong/supacloud-1/issues/1301)) ([b2c1df2](https://github.com/zuohuadong/supacloud-1/commit/b2c1df25294d0195ddf313623b965e599847d9f9))
* **cli:** add app context and doctor for AI-driven development ([#1370](https://github.com/zuohuadong/supacloud-1/issues/1370)) ([9212d84](https://github.com/zuohuadong/supacloud-1/commit/9212d8425d9e052138eac28178882c2b3f58f733))
* **cli:** add application delivery workflow ([#1490](https://github.com/zuohuadong/supacloud-1/issues/1490)) ([da5b4e4](https://github.com/zuohuadong/supacloud-1/commit/da5b4e4098b0478553cc09876217441e24aa8f04))
* **cli:** add doctor autoFixable summary and fix plan ([#1379](https://github.com/zuohuadong/supacloud-1/issues/1379)) ([d623325](https://github.com/zuohuadong/supacloud-1/commit/d623325af49864f08c26741bd1b06f707bc098a9))
* **cli:** add governed application starter ([#1193](https://github.com/zuohuadong/supacloud-1/issues/1193)) ([f33561b](https://github.com/zuohuadong/supacloud-1/commit/f33561bfb05e0a63ce08de0153a4fa95f02ac2d6))
* **cli:** add http and edge golden-path project templates ([#1376](https://github.com/zuohuadong/supacloud-1/issues/1376)) ([172fa2c](https://github.com/zuohuadong/supacloud-1/commit/172fa2c45844f0eaab7cbb5e77457976bf5b6505))
* **cli:** add profile-aware app dev local entry (P0-2) ([#1514](https://github.com/zuohuadong/supacloud-1/issues/1514)) ([4e49247](https://github.com/zuohuadong/supacloud-1/commit/4e4924766129a21befb6b01d8844eee55001c382))
* **cli:** add release scope rebind, inspect, and create controls ([#1195](https://github.com/zuohuadong/supacloud-1/issues/1195)) ([285882f](https://github.com/zuohuadong/supacloud-1/commit/285882ff6c56496a70413b660e21369fa2568ac5))
* **cli:** allow explicit insecure TLS for test environments ([#1165](https://github.com/zuohuadong/supacloud-1/issues/1165)) ([228a9b7](https://github.com/zuohuadong/supacloud-1/commit/228a9b704c02a0a7b52d7b402c7c500840ec0fff))
* **cli:** default to permissive TLS for internal deployments ([#1170](https://github.com/zuohuadong/supacloud-1/issues/1170)) ([2b4790c](https://github.com/zuohuadong/supacloud-1/commit/2b4790cd3e4fc7cbcf98d7c16fb07d6ffe1d9f31))
* **cli:** explain jobs from the compiled manifest ([#1383](https://github.com/zuohuadong/supacloud-1/issues/1383)) ([97bde74](https://github.com/zuohuadong/supacloud-1/commit/97bde74359b6c5c04fbeb9755e3b3b4b092d512b))
* **cli:** expose allowed dependencies in context and assert fix recheck ([#1378](https://github.com/zuohuadong/supacloud-1/issues/1378)) ([cdb2e6b](https://github.com/zuohuadong/supacloud-1/commit/cdb2e6b9eeee3d818cbf348a503e77215ea6d9cf))
* **cli:** guide contract wiring and document quick start ([#1380](https://github.com/zuohuadong/supacloud-1/issues/1380)) ([77a42a5](https://github.com/zuohuadong/supacloud-1/commit/77a42a56aaba682effc0dc6ccba6be5d350aa926))
* **cli:** safe resource generation and packed consumer acceptance ([#1510](https://github.com/zuohuadong/supacloud-1/issues/1510)) ([4b743b2](https://github.com/zuohuadong/supacloud-1/commit/4b743b2e1d3829add5f891d8f211690386595a46))
* **cli:** support configurable upload body limits for edge functions and host install ([#1274](https://github.com/zuohuadong/supacloud-1/issues/1274)) ([5f9e85a](https://github.com/zuohuadong/supacloud-1/commit/5f9e85aa502e06e739fa9e6d43e2bcc1f94d721a))
* **cli:** support unrestricted manual file upload for storage ([#1276](https://github.com/zuohuadong/supacloud-1/issues/1276)) ([53eae1f](https://github.com/zuohuadong/supacloud-1/commit/53eae1f1af3014c014b5cb65127cb9fff2291696))
* **compiler:** add database-first GraphQL query contracts ([#1224](https://github.com/zuohuadong/supacloud-1/issues/1224)) ([a10e0d5](https://github.com/zuohuadong/supacloud-1/commit/a10e0d54f87bee79c0a3a34f9b8685a994eb444b))
* **compiler:** diagnose browser-unsafe client schemas ([#1679](https://github.com/zuohuadong/supacloud-1/issues/1679)) ([18582fc](https://github.com/zuohuadong/supacloud-1/commit/18582fcc0384246d87660cb42b6b4acbdc475b5e))
* complete Angular framework defaults integration ([#1587](https://github.com/zuohuadong/supacloud-1/issues/1587)) ([0dec8ea](https://github.com/zuohuadong/supacloud-1/commit/0dec8ea48f288da27824579038136dd33f8ccb20))
* converge SDK-aware vibecoding defaults and local development ([#1607](https://github.com/zuohuadong/supacloud-1/issues/1607)) ([cd66672](https://github.com/zuohuadong/supacloud-1/commit/cd6667252a6a8fe0cc0539bc8610ebb8a818af51))
* **db:** default database starters to Drizzle and source-contract gates ([#1599](https://github.com/zuohuadong/supacloud-1/issues/1599)) ([133eb9b](https://github.com/zuohuadong/supacloud-1/commit/133eb9b0d3a6be3690c290041db3906635a376e7))
* default RxJS support with compatible SupaCloud JS calls ([#1556](https://github.com/zuohuadong/supacloud-1/issues/1556)) ([b3015cb](https://github.com/zuohuadong/supacloud-1/commit/b3015cb161c0d87e6611f6c4fc60c120a8c9fffe))
* **delivery:** expose deployment evidence through management surfaces ([2efb236](https://github.com/zuohuadong/supacloud-1/commit/2efb23664cec5a86b0535c530f91a5c7a871626b))
* **elysia,compiler:** upgrade to elysia 2.0.0-beta.21 and document aot compiler integration ([#1665](https://github.com/zuohuadong/supacloud-1/issues/1665)) ([a4ae346](https://github.com/zuohuadong/supacloud-1/commit/a4ae346053e004a82b8e552165b9419d9fd418d8))
* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/zuohuadong/supacloud-1/issues/1654)) ([39ee49f](https://github.com/zuohuadong/supacloud-1/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))
* establish single-node delivery baseline ([#1632](https://github.com/zuohuadong/supacloud-1/issues/1632)) ([926de6c](https://github.com/zuohuadong/supacloud-1/commit/926de6c6c72940f7c03e046908ef446c54d37621))
* **extensions:** manage canonical pgflow installation and pause state ([#1331](https://github.com/zuohuadong/supacloud-1/issues/1331)) ([aa666eb](https://github.com/zuohuadong/supacloud-1/commit/aa666eb48130508f39a41523d8aeefdf25912e9a))
* **framework:** improve vibecoding development workflow ([#1430](https://github.com/zuohuadong/supacloud-1/issues/1430)) ([7bd35ff](https://github.com/zuohuadong/supacloud-1/commit/7bd35ff216fd276f10643f0f13ae217375badc76))
* **framework:** make command governance default ([#1342](https://github.com/zuohuadong/supacloud-1/issues/1342)) ([5ef7362](https://github.com/zuohuadong/supacloud-1/commit/5ef7362ea0bd9f260576b7ecc4c7eef71aa752b4))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* **js:** publish SDK and Contracts as dual MJS and CJS ([#1585](https://github.com/zuohuadong/supacloud-1/issues/1585)) ([6183f3e](https://github.com/zuohuadong/supacloud-1/commit/6183f3e7e985f1fb06a6b31aaf2bab125bb1b34d))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))
* **tooling:** synchronize starter metadata and validate local build caching ([#1608](https://github.com/zuohuadong/supacloud-1/issues/1608)) ([31137b1](https://github.com/zuohuadong/supacloud-1/commit/31137b135b31251d9837518c9fb31a330c8f4c58))


### Bug Fixes

* **cli:** explain unknown deployment outcomes ([#1360](https://github.com/zuohuadong/supacloud-1/issues/1360)) ([bb2f6d0](https://github.com/zuohuadong/supacloud-1/commit/bb2f6d01f83e9b050d5f69e99635988eb928fc86))
* **cli:** extend edge function deploy timeout ([#1602](https://github.com/zuohuadong/supacloud-1/issues/1602)) ([6d94d74](https://github.com/zuohuadong/supacloud-1/commit/6d94d745034a03a6fa1d52da1325a09b4d943446))
* **cli:** install delivery deps before building local compiler ([#1466](https://github.com/zuohuadong/supacloud-1/issues/1466)) ([4295663](https://github.com/zuohuadong/supacloud-1/commit/4295663225ecf53fe2c72903ae8000e2cb3cd4fa))
* **cli:** sync published compiler dependency ([#1174](https://github.com/zuohuadong/supacloud-1/issues/1174)) ([af811e0](https://github.com/zuohuadong/supacloud-1/commit/af811e04af7328773090cbfb4773df1cdc016c92))
* **cli:** sync published compiler dependency ([#1184](https://github.com/zuohuadong/supacloud-1/issues/1184)) ([1ecf5c5](https://github.com/zuohuadong/supacloud-1/commit/1ecf5c5e23b149e4a3104a6be654a1bd36112059))
* **cli:** sync published compiler dependency ([#1197](https://github.com/zuohuadong/supacloud-1/issues/1197)) ([89e25a7](https://github.com/zuohuadong/supacloud-1/commit/89e25a79d6db27ff045ae05e55ab5c5f3d8d881f))
* **cli:** sync published compiler dependency ([#1204](https://github.com/zuohuadong/supacloud-1/issues/1204)) ([6def11a](https://github.com/zuohuadong/supacloud-1/commit/6def11aea609d39d9448dfac0ebd01864c42551b))
* **cli:** sync published compiler dependency ([#1223](https://github.com/zuohuadong/supacloud-1/issues/1223)) ([6de79e2](https://github.com/zuohuadong/supacloud-1/commit/6de79e20cf3133b45cc8f5f475245cced4841730))
* **cli:** sync published compiler dependency ([#1227](https://github.com/zuohuadong/supacloud-1/issues/1227)) ([391616b](https://github.com/zuohuadong/supacloud-1/commit/391616bf381a924377dcac0add0a7033dc7f2a10))
* **cli:** sync published compiler dependency ([#1240](https://github.com/zuohuadong/supacloud-1/issues/1240)) ([13bac7f](https://github.com/zuohuadong/supacloud-1/commit/13bac7f164ef5c2761e90ed3e74ff2d89823eae7))
* **cli:** sync published compiler dependency ([#1312](https://github.com/zuohuadong/supacloud-1/issues/1312)) ([038899c](https://github.com/zuohuadong/supacloud-1/commit/038899cd8afba265f89a93cccce1b4225a04ea4a))
* **cli:** sync published compiler dependency ([#1326](https://github.com/zuohuadong/supacloud-1/issues/1326)) ([2778c7d](https://github.com/zuohuadong/supacloud-1/commit/2778c7d44b9d3350f8483cb8cb7611b64affcaa9))
* **cli:** sync published compiler dependency ([#1335](https://github.com/zuohuadong/supacloud-1/issues/1335)) ([248c080](https://github.com/zuohuadong/supacloud-1/commit/248c080b0a5a2f41de772706bda152b010a8df38))
* **cli:** sync published compiler dependency ([#1352](https://github.com/zuohuadong/supacloud-1/issues/1352)) ([51136e4](https://github.com/zuohuadong/supacloud-1/commit/51136e42a599ee2cf565c4f0a5be3d258a4b3a1c))
* **cli:** sync published compiler dependency ([#1395](https://github.com/zuohuadong/supacloud-1/issues/1395)) ([bb247a2](https://github.com/zuohuadong/supacloud-1/commit/bb247a2f3f07168dc3295397fcc6ca96fcf85ca2))
* **cli:** sync published compiler dependency ([#1407](https://github.com/zuohuadong/supacloud-1/issues/1407)) ([9c05538](https://github.com/zuohuadong/supacloud-1/commit/9c05538a655c353a94317f9532472ea6588797ae))
* **cli:** sync published compiler dependency ([#1444](https://github.com/zuohuadong/supacloud-1/issues/1444)) ([bdbd2ab](https://github.com/zuohuadong/supacloud-1/commit/bdbd2ab773143f409fc304e89b56272e46630156))
* **cli:** sync published compiler dependency ([#1469](https://github.com/zuohuadong/supacloud-1/issues/1469)) ([f8ac7fb](https://github.com/zuohuadong/supacloud-1/commit/f8ac7fb754d4a8d2014da3831b9d3b84a0546f55))
* **cli:** sync published compiler dependency ([#1473](https://github.com/zuohuadong/supacloud-1/issues/1473)) ([677e3f8](https://github.com/zuohuadong/supacloud-1/commit/677e3f82b10793dcdb843ed422760f516aa3b0a6))
* **cli:** sync published compiler dependency ([#1477](https://github.com/zuohuadong/supacloud-1/issues/1477)) ([de1debe](https://github.com/zuohuadong/supacloud-1/commit/de1debecbe48d0a784ce31caefa54385dfa46267))
* **cli:** sync published compiler dependency ([#1485](https://github.com/zuohuadong/supacloud-1/issues/1485)) ([0626bf8](https://github.com/zuohuadong/supacloud-1/commit/0626bf884e381931577074b337322c8c2158cff7))
* **cli:** sync published compiler dependency ([#1590](https://github.com/zuohuadong/supacloud-1/issues/1590)) ([a6f492a](https://github.com/zuohuadong/supacloud-1/commit/a6f492adeb61916d461baf56f0c432087c830d67))
* **cli:** sync published compiler dependency ([#1598](https://github.com/zuohuadong/supacloud-1/issues/1598)) ([0921645](https://github.com/zuohuadong/supacloud-1/commit/092164593cf8e793c3c277f10e82cb106f43c370))
* **cli:** sync published compiler dependency ([#1605](https://github.com/zuohuadong/supacloud-1/issues/1605)) ([25f303d](https://github.com/zuohuadong/supacloud-1/commit/25f303ded9aa1883dfe3823e252f1778581ed0af))
* **cli:** sync published compiler dependency ([#1612](https://github.com/zuohuadong/supacloud-1/issues/1612)) ([eef9668](https://github.com/zuohuadong/supacloud-1/commit/eef9668abb0f9e40224f71868ca5234c9efa11df))
* **cli:** sync published compiler dependency ([#1621](https://github.com/zuohuadong/supacloud-1/issues/1621)) ([978f503](https://github.com/zuohuadong/supacloud-1/commit/978f503c40dd799babc7547f4e24c6bda4e0840e))
* **cli:** sync published compiler dependency ([#1636](https://github.com/zuohuadong/supacloud-1/issues/1636)) ([4b9ae47](https://github.com/zuohuadong/supacloud-1/commit/4b9ae4722c356485dd6476a43d387c97ec6847b2))
* **cli:** sync published compiler dependency ([#1640](https://github.com/zuohuadong/supacloud-1/issues/1640)) ([8c78e53](https://github.com/zuohuadong/supacloud-1/commit/8c78e537cfa1038fc4f030e747c07b573c702aad))
* **cli:** sync published compiler dependency ([#1646](https://github.com/zuohuadong/supacloud-1/issues/1646)) ([78354f6](https://github.com/zuohuadong/supacloud-1/commit/78354f6f074d7b3b67eb45885abf7915cdaeb4df))
* **cli:** sync published compiler dependency ([#1650](https://github.com/zuohuadong/supacloud-1/issues/1650)) ([c0b739e](https://github.com/zuohuadong/supacloud-1/commit/c0b739e1b863c6a1a61b7bfa91efc16278225a2b))
* **cli:** sync published compiler dependency ([#1660](https://github.com/zuohuadong/supacloud-1/issues/1660)) ([7e2f4a5](https://github.com/zuohuadong/supacloud-1/commit/7e2f4a5aee1aa6af2b602829df6531ce8a0999d3))
* **cli:** sync published compiler dependency ([#1684](https://github.com/zuohuadong/supacloud-1/issues/1684)) ([348c101](https://github.com/zuohuadong/supacloud-1/commit/348c101a1f36026cf8dc2a1d497f99630d85fa8e))
* **compiler:** compose generated clients with frontend SDK auth ([#1603](https://github.com/zuohuadong/supacloud-1/issues/1603)) ([7b14968](https://github.com/zuohuadong/supacloud-1/commit/7b1496828a9ade663f2a3d4572252af966296763))
* **deps,perf:** replace Bun native APIs and resolve audit vulnerabilities ([#1667](https://github.com/zuohuadong/supacloud-1/issues/1667)) ([06a9199](https://github.com/zuohuadong/supacloud-1/commit/06a91990c754ce586f2a2353f253dc50f4fa0f98))
* **deps:** sync published CLI and compiler dependencies ([#1545](https://github.com/zuohuadong/supacloud-1/issues/1545)) ([11de44e](https://github.com/zuohuadong/supacloud-1/commit/11de44e43ef1e0ba00c45e5bcf699ca4923987ae))
* **dev:** repair watch lifecycle and development reports ([#1524](https://github.com/zuohuadong/supacloud-1/issues/1524)) ([69fd216](https://github.com/zuohuadong/supacloud-1/commit/69fd216cbeb3bc68ca182d488bc86e8061283468))
* pin Elysia 2 beta compatibility boundary ([#1467](https://github.com/zuohuadong/supacloud-1/issues/1467)) ([bdb2a2e](https://github.com/zuohuadong/supacloud-1/commit/bdb2a2e658cae4160f2a774b5c459d1a2d8fb601))
* pin npm registry for reproducible installs in remaining packages ([#1414](https://github.com/zuohuadong/supacloud-1/issues/1414)) ([8110f3c](https://github.com/zuohuadong/supacloud-1/commit/8110f3c889ac48bc8e4cee35eb37ce7406d35587))
* **supacloud:** sync published CLI dependencies ([#1614](https://github.com/zuohuadong/supacloud-1/issues/1614)) ([dc06ea2](https://github.com/zuohuadong/supacloud-1/commit/dc06ea215534fb1d5a2f342c8716075235be28c0))


### Elegance & Refactoring

* use ESM-only owned packages and Lite launcher ([#1582](https://github.com/zuohuadong/supacloud-1/issues/1582)) ([ed5ac78](https://github.com/zuohuadong/supacloud-1/commit/ed5ac78ee3ab22567268fa276e5b016ad1e8b575))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1166](https://github.com/zuohuadong/supacloud-1/issues/1166)) ([2cb6deb](https://github.com/zuohuadong/supacloud-1/commit/2cb6deb1d27c78973eb6a3479b851b98073bc2ba))
* release main ([#1172](https://github.com/zuohuadong/supacloud-1/issues/1172)) ([b542d86](https://github.com/zuohuadong/supacloud-1/commit/b542d86f31bc2c390751924706b3cd3bd8a2c8b9))
* release main ([#1176](https://github.com/zuohuadong/supacloud-1/issues/1176)) ([c04a50d](https://github.com/zuohuadong/supacloud-1/commit/c04a50df7df76408208429587970fd1e66ffc789))
* release main ([#1179](https://github.com/zuohuadong/supacloud-1/issues/1179)) ([8f186bc](https://github.com/zuohuadong/supacloud-1/commit/8f186bc368e6ef17ed7d3e58d9429845af1bd110))
* release main ([#1186](https://github.com/zuohuadong/supacloud-1/issues/1186)) ([10db533](https://github.com/zuohuadong/supacloud-1/commit/10db533b1833a12880852a69ae0611e8cb5beb37))
* release main ([#1194](https://github.com/zuohuadong/supacloud-1/issues/1194)) ([7d0eb27](https://github.com/zuohuadong/supacloud-1/commit/7d0eb27ec8b118321e9085aff6cd9f77a2eec642))
* release main ([#1199](https://github.com/zuohuadong/supacloud-1/issues/1199)) ([f374806](https://github.com/zuohuadong/supacloud-1/commit/f3748068f6f0a838b668b81a7b23f9cffd74ca37))
* release main ([#1205](https://github.com/zuohuadong/supacloud-1/issues/1205)) ([89b7f2a](https://github.com/zuohuadong/supacloud-1/commit/89b7f2afdde2a87b93f9d4ac35b1e15906ffb1d5))
* release main ([#1221](https://github.com/zuohuadong/supacloud-1/issues/1221)) ([254364e](https://github.com/zuohuadong/supacloud-1/commit/254364e9b29bcf873773ef0e54017422e7889a0c))
* release main ([#1225](https://github.com/zuohuadong/supacloud-1/issues/1225)) ([d6f6c78](https://github.com/zuohuadong/supacloud-1/commit/d6f6c786ef436d24ab0ab6caaabeb7a4738af552))
* release main ([#1235](https://github.com/zuohuadong/supacloud-1/issues/1235)) ([bf00a8f](https://github.com/zuohuadong/supacloud-1/commit/bf00a8f0a240d20dbd79a3cda1f8e7fca76b16c0))
* release main ([#1241](https://github.com/zuohuadong/supacloud-1/issues/1241)) ([18f84be](https://github.com/zuohuadong/supacloud-1/commit/18f84be77160d737486e9f0b2861ace91452e0f3))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1275](https://github.com/zuohuadong/supacloud-1/issues/1275)) ([74f8b25](https://github.com/zuohuadong/supacloud-1/commit/74f8b2592900679c8d25fa9bccd4a6b90f37ae39))
* release main ([#1303](https://github.com/zuohuadong/supacloud-1/issues/1303)) ([7cf5889](https://github.com/zuohuadong/supacloud-1/commit/7cf588922e5081926e34ae8b2438634e0ea16c2a))
* release main ([#1314](https://github.com/zuohuadong/supacloud-1/issues/1314)) ([0f17f04](https://github.com/zuohuadong/supacloud-1/commit/0f17f0425f9ed699da0cb6f2b0716ef0a533d647))
* release main ([#1330](https://github.com/zuohuadong/supacloud-1/issues/1330)) ([95384f8](https://github.com/zuohuadong/supacloud-1/commit/95384f8db80b2706b30953f26944cc681f810543))
* release main ([#1336](https://github.com/zuohuadong/supacloud-1/issues/1336)) ([22caef4](https://github.com/zuohuadong/supacloud-1/commit/22caef42e767c4b6dc7d8b0d1a04e81a3af84cbc))
* release main ([#1351](https://github.com/zuohuadong/supacloud-1/issues/1351)) ([5e27d1a](https://github.com/zuohuadong/supacloud-1/commit/5e27d1af135d154aa4dc924910bf8204a02942ae))
* release main ([#1354](https://github.com/zuohuadong/supacloud-1/issues/1354)) ([3191c50](https://github.com/zuohuadong/supacloud-1/commit/3191c508ae4641c8a55a61403cd34218bbe904c2))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1396](https://github.com/zuohuadong/supacloud-1/issues/1396)) ([f7c94b8](https://github.com/zuohuadong/supacloud-1/commit/f7c94b8ae4c061ea0edc4ada526fe30c2be18d1b))
* release main ([#1408](https://github.com/zuohuadong/supacloud-1/issues/1408)) ([8365129](https://github.com/zuohuadong/supacloud-1/commit/8365129b5b5c2325ff688d7f4109a9806b5970f4))
* release main ([#1413](https://github.com/zuohuadong/supacloud-1/issues/1413)) ([0b0f637](https://github.com/zuohuadong/supacloud-1/commit/0b0f637b9eed202f8aa64a3d67ad6469b468bdb9))
* release main ([#1431](https://github.com/zuohuadong/supacloud-1/issues/1431)) ([b7255e6](https://github.com/zuohuadong/supacloud-1/commit/b7255e6fbb277e0fdcbbe7cfeacc81cee62f7fe2))
* release main ([#1445](https://github.com/zuohuadong/supacloud-1/issues/1445)) ([07ca2f4](https://github.com/zuohuadong/supacloud-1/commit/07ca2f49efc375666eb13599747c0a8962430a19))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1468](https://github.com/zuohuadong/supacloud-1/issues/1468)) ([693e983](https://github.com/zuohuadong/supacloud-1/commit/693e98382cfc7468147a433fff51c5e86ea479d0))
* release main ([#1474](https://github.com/zuohuadong/supacloud-1/issues/1474)) ([6255eb7](https://github.com/zuohuadong/supacloud-1/commit/6255eb7e7eefc4ee5cd06bef05d4c81a29be706a))
* release main ([#1478](https://github.com/zuohuadong/supacloud-1/issues/1478)) ([659198e](https://github.com/zuohuadong/supacloud-1/commit/659198e78e2ab14465a3d4f28fa0da143f0ed2c8))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1487](https://github.com/zuohuadong/supacloud-1/issues/1487)) ([e1d1ec8](https://github.com/zuohuadong/supacloud-1/commit/e1d1ec8d0596f4e8624358d006c0150ec17c95e0))
* release main ([#1492](https://github.com/zuohuadong/supacloud-1/issues/1492)) ([eb37eeb](https://github.com/zuohuadong/supacloud-1/commit/eb37eeb972a299f54edb356b1959800c16e6d511))
* release main ([#1507](https://github.com/zuohuadong/supacloud-1/issues/1507)) ([b7f3a59](https://github.com/zuohuadong/supacloud-1/commit/b7f3a59885596742a8b11fc808d898165a8989ec))
* release main ([#1550](https://github.com/zuohuadong/supacloud-1/issues/1550)) ([06b5266](https://github.com/zuohuadong/supacloud-1/commit/06b52667d9c23ea92053a36b0251cf93624c1014))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1586](https://github.com/zuohuadong/supacloud-1/issues/1586)) ([21f22d8](https://github.com/zuohuadong/supacloud-1/commit/21f22d8dba3a1e6e704865727ed5ff4095d28eac))
* release main ([#1592](https://github.com/zuohuadong/supacloud-1/issues/1592)) ([224f76d](https://github.com/zuohuadong/supacloud-1/commit/224f76dfff188cf943152c3ee23cff2269d4d2b9))
* release main ([#1600](https://github.com/zuohuadong/supacloud-1/issues/1600)) ([5209a75](https://github.com/zuohuadong/supacloud-1/commit/5209a7589b785d8243be24ad3ec25a0ccdb7b42c))
* release main ([#1609](https://github.com/zuohuadong/supacloud-1/issues/1609)) ([b52c79c](https://github.com/zuohuadong/supacloud-1/commit/b52c79ceda912786f1299ae2d618172f9252607a))
* release main ([#1610](https://github.com/zuohuadong/supacloud-1/issues/1610)) ([6517b06](https://github.com/zuohuadong/supacloud-1/commit/6517b06bdb9cfb02062288c4bfd1d09fbab1663c))
* release main ([#1613](https://github.com/zuohuadong/supacloud-1/issues/1613)) ([ffac151](https://github.com/zuohuadong/supacloud-1/commit/ffac1515049ee05af290bed345dfd197b1142a27))
* release main ([#1617](https://github.com/zuohuadong/supacloud-1/issues/1617)) ([afad389](https://github.com/zuohuadong/supacloud-1/commit/afad38960cf086afeddcdc4565daa7b8cb429c2e))
* release main ([#1626](https://github.com/zuohuadong/supacloud-1/issues/1626)) ([2fe1c18](https://github.com/zuohuadong/supacloud-1/commit/2fe1c187866dd5ba1c1d414f4a7f8b25923209b7))
* release main ([#1633](https://github.com/zuohuadong/supacloud-1/issues/1633)) ([e9db823](https://github.com/zuohuadong/supacloud-1/commit/e9db823b47db6b0d9ebe8057792e35e34c144420))
* release main ([#1638](https://github.com/zuohuadong/supacloud-1/issues/1638)) ([1857d39](https://github.com/zuohuadong/supacloud-1/commit/1857d39b2639e5ddf8f0a671b4167ba9c2f15c39))
* release main ([#1642](https://github.com/zuohuadong/supacloud-1/issues/1642)) ([2c2de43](https://github.com/zuohuadong/supacloud-1/commit/2c2de431073a6097f7589bc8b2f413508aec82b4))
* release main ([#1647](https://github.com/zuohuadong/supacloud-1/issues/1647)) ([9afdb5c](https://github.com/zuohuadong/supacloud-1/commit/9afdb5c348a2e87169e8898b3842091bb8f1ddea))
* release main ([#1651](https://github.com/zuohuadong/supacloud-1/issues/1651)) ([2e9cb18](https://github.com/zuohuadong/supacloud-1/commit/2e9cb185d6938c5b38fa8279fb9f131bac87d8f3))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1661](https://github.com/zuohuadong/supacloud-1/issues/1661)) ([77ea3fa](https://github.com/zuohuadong/supacloud-1/commit/77ea3fa73707222f21561005a6be3569dae606b4))
* release main ([#1666](https://github.com/zuohuadong/supacloud-1/issues/1666)) ([863a507](https://github.com/zuohuadong/supacloud-1/commit/863a50718aed6d724ee9a055346b6a155068a4a1))
* release main ([#1668](https://github.com/zuohuadong/supacloud-1/issues/1668)) ([a7ce18b](https://github.com/zuohuadong/supacloud-1/commit/a7ce18b73e0a2e93df664fb8da08cd40f3bdae82))
* release main ([#1671](https://github.com/zuohuadong/supacloud-1/issues/1671)) ([b413a37](https://github.com/zuohuadong/supacloud-1/commit/b413a37ba0b1c8cf7a33649774c1935febd46f92))
* release main ([#1675](https://github.com/zuohuadong/supacloud-1/issues/1675)) ([6c0e304](https://github.com/zuohuadong/supacloud-1/commit/6c0e304bd54830dc36e8ef1bfc004c4bed84fb97))
* release main ([#1683](https://github.com/zuohuadong/supacloud-1/issues/1683)) ([9393da6](https://github.com/zuohuadong/supacloud-1/commit/9393da66289b8a341f4a3c7fe8553e53986c4bdc))
* release main ([#1686](https://github.com/zuohuadong/supacloud-1/issues/1686)) ([843b076](https://github.com/zuohuadong/supacloud-1/commit/843b076178052aaa700543c9deced02f6091178c))
</details>

<details><summary>admin: 0.25.0</summary>

## [0.25.0](https://github.com/zuohuadong/supacloud-1/compare/admin-v0.24.2...admin-v0.25.0) (2026-10-31)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **cli:** support configurable upload body limits for edge functions and host install ([#1274](https://github.com/zuohuadong/supacloud-1/issues/1274)) ([5f9e85a](https://github.com/zuohuadong/supacloud-1/commit/5f9e85aa502e06e739fa9e6d43e2bcc1f94d721a))
* **cli:** support unrestricted manual file upload for storage ([#1276](https://github.com/zuohuadong/supacloud-1/issues/1276)) ([53eae1f](https://github.com/zuohuadong/supacloud-1/commit/53eae1f1af3014c014b5cb65127cb9fff2291696))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))


### Bug Fixes

* **admin:** allow local transport proxy for offline release downloads ([#1281](https://github.com/zuohuadong/supacloud-1/issues/1281)) ([fa2137d](https://github.com/zuohuadong/supacloud-1/commit/fa2137d200ad5a44bbd2e0da558ebe93369f167a))
* **admin:** republish package metadata ([#1398](https://github.com/zuohuadong/supacloud-1/issues/1398)) ([b4e0357](https://github.com/zuohuadong/supacloud-1/commit/b4e035768c4b56634af71b426bf458808cb650cd))
* **admin:** resolve upgrade release versions with valid jq patterns ([#1237](https://github.com/zuohuadong/supacloud-1/issues/1237)) ([45a26d2](https://github.com/zuohuadong/supacloud-1/commit/45a26d2bfb1709ed9acad2c9220e577ae4355fa5))
* **deps,perf:** replace Bun native APIs and resolve audit vulnerabilities ([#1667](https://github.com/zuohuadong/supacloud-1/issues/1667)) ([06a9199](https://github.com/zuohuadong/supacloud-1/commit/06a91990c754ce586f2a2353f253dc50f4fa0f98))


### Elegance & Refactoring

* **admin:** import shared CLI tools through the package contract ([#1371](https://github.com/zuohuadong/supacloud-1/issues/1371)) ([6a225e4](https://github.com/zuohuadong/supacloud-1/commit/6a225e40ccacd5455542a843a82cf59d46e75e70))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1238](https://github.com/zuohuadong/supacloud-1/issues/1238)) ([13f8362](https://github.com/zuohuadong/supacloud-1/commit/13f8362d3aeca8da91d16cfb840e2b1428914a1c))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1275](https://github.com/zuohuadong/supacloud-1/issues/1275)) ([74f8b25](https://github.com/zuohuadong/supacloud-1/commit/74f8b2592900679c8d25fa9bccd4a6b90f37ae39))
* release main ([#1282](https://github.com/zuohuadong/supacloud-1/issues/1282)) ([eded86a](https://github.com/zuohuadong/supacloud-1/commit/eded86a6589cc274939d4cadc67f629cd3f17865))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1399](https://github.com/zuohuadong/supacloud-1/issues/1399)) ([a2a3600](https://github.com/zuohuadong/supacloud-1/commit/a2a36005421d7436f01553756449fb5e95beb052))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1668](https://github.com/zuohuadong/supacloud-1/issues/1668)) ([a7ce18b](https://github.com/zuohuadong/supacloud-1/commit/a7ce18b73e0a2e93df664fb8da08cd40f3bdae82))
</details>

<details><summary>function-adapter: 0.5.0</summary>

## [0.5.0](https://github.com/zuohuadong/supacloud-1/compare/function-adapter-v0.4.1...function-adapter-v0.5.0) (2026-10-31)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))


### Bug Fixes

* **deps,perf:** replace Bun native APIs and resolve audit vulnerabilities ([#1667](https://github.com/zuohuadong/supacloud-1/issues/1667)) ([06a9199](https://github.com/zuohuadong/supacloud-1/commit/06a91990c754ce586f2a2353f253dc50f4fa0f98))
* **release:** retry npm view after a just-published sibling ([a9576cd](https://github.com/zuohuadong/supacloud-1/commit/a9576cd8b76cf99ebb73bada7bbcb3351148099c))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1310](https://github.com/zuohuadong/supacloud-1/issues/1310)) ([134b716](https://github.com/zuohuadong/supacloud-1/commit/134b716b357a5bb257b91e2ef78d689773f75f9d))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1668](https://github.com/zuohuadong/supacloud-1/issues/1668)) ([a7ce18b](https://github.com/zuohuadong/supacloud-1/commit/a7ce18b73e0a2e93df664fb8da08cd40f3bdae82))
</details>

<details><summary>supacloud: 0.15.0</summary>

## [0.15.0](https://github.com/zuohuadong/supacloud-1/compare/supacloud-v0.14.16...supacloud-v0.15.0) (2026-10-31)


### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))


### Bug Fixes

* **deps,perf:** replace Bun native APIs and resolve audit vulnerabilities ([#1667](https://github.com/zuohuadong/supacloud-1/issues/1667)) ([06a9199](https://github.com/zuohuadong/supacloud-1/commit/06a91990c754ce586f2a2353f253dc50f4fa0f98))
* **deps:** sync published CLI and compiler dependencies ([#1545](https://github.com/zuohuadong/supacloud-1/issues/1545)) ([11de44e](https://github.com/zuohuadong/supacloud-1/commit/11de44e43ef1e0ba00c45e5bcf699ca4923987ae))
* **supacloud:** pin npm registry for reproducible installs ([#1412](https://github.com/zuohuadong/supacloud-1/issues/1412)) ([8cd352c](https://github.com/zuohuadong/supacloud-1/commit/8cd352c5e7f9d90d80b48142bcf07bebe7b44aed))
* **supacloud:** sync published CLI dependencies ([#1177](https://github.com/zuohuadong/supacloud-1/issues/1177)) ([7cd0148](https://github.com/zuohuadong/supacloud-1/commit/7cd014824cb0bd714495cea69070eae51a4f6c58))
* **supacloud:** sync published CLI dependencies ([#1188](https://github.com/zuohuadong/supacloud-1/issues/1188)) ([90cfcce](https://github.com/zuohuadong/supacloud-1/commit/90cfcceef1832c2da0935928b7ba7758c7087f10))
* **supacloud:** sync published CLI dependencies ([#1196](https://github.com/zuohuadong/supacloud-1/issues/1196)) ([a4dc1eb](https://github.com/zuohuadong/supacloud-1/commit/a4dc1ebe1bb43ce0af7a7f822d5dc192cfde43bf))
* **supacloud:** sync published CLI dependencies ([#1202](https://github.com/zuohuadong/supacloud-1/issues/1202)) ([cec611f](https://github.com/zuohuadong/supacloud-1/commit/cec611f955980ee2f1905d6725519aa7ada98db8))
* **supacloud:** sync published CLI dependencies ([#1206](https://github.com/zuohuadong/supacloud-1/issues/1206)) ([8c686cb](https://github.com/zuohuadong/supacloud-1/commit/8c686cbd8ffac29dbca41536e81c6f269c6646b4))
* **supacloud:** sync published CLI dependencies ([#1222](https://github.com/zuohuadong/supacloud-1/issues/1222)) ([a408d87](https://github.com/zuohuadong/supacloud-1/commit/a408d87fe1e3180ee346b48f1dbefee3f4b8710c))
* **supacloud:** sync published CLI dependencies ([#1226](https://github.com/zuohuadong/supacloud-1/issues/1226)) ([8c11909](https://github.com/zuohuadong/supacloud-1/commit/8c1190975d408a556258bbf1f1bdfd0c43918a82))
* **supacloud:** sync published CLI dependencies ([#1236](https://github.com/zuohuadong/supacloud-1/issues/1236)) ([ec5a84b](https://github.com/zuohuadong/supacloud-1/commit/ec5a84b7c206a5b63b69d0c3c0b4bf3f167448bf))
* **supacloud:** sync published CLI dependencies ([#1242](https://github.com/zuohuadong/supacloud-1/issues/1242)) ([2ab2624](https://github.com/zuohuadong/supacloud-1/commit/2ab2624b52c9a5af1d981fb51cde0439d5229648))
* **supacloud:** sync published CLI dependencies ([#1313](https://github.com/zuohuadong/supacloud-1/issues/1313)) ([7d2fde0](https://github.com/zuohuadong/supacloud-1/commit/7d2fde06379f001d1f5785a8b542b08865080938))
* **supacloud:** sync published CLI dependencies ([#1316](https://github.com/zuohuadong/supacloud-1/issues/1316)) ([30cd729](https://github.com/zuohuadong/supacloud-1/commit/30cd729ca245b00012c8deb2402aa44f93e8f41f))
* **supacloud:** sync published CLI dependencies ([#1334](https://github.com/zuohuadong/supacloud-1/issues/1334)) ([550c943](https://github.com/zuohuadong/supacloud-1/commit/550c94303f0cd525f51944ee7c068753dc0db963))
* **supacloud:** sync published CLI dependencies ([#1337](https://github.com/zuohuadong/supacloud-1/issues/1337)) ([eb3b996](https://github.com/zuohuadong/supacloud-1/commit/eb3b996a5a6b248590fc6e59de58db24c9c1e3b5))
* **supacloud:** sync published CLI dependencies ([#1353](https://github.com/zuohuadong/supacloud-1/issues/1353)) ([ca4533d](https://github.com/zuohuadong/supacloud-1/commit/ca4533d8f42e963bfc41df3b8b82c0ad402f10a0))
* **supacloud:** sync published CLI dependencies ([#1355](https://github.com/zuohuadong/supacloud-1/issues/1355)) ([c452d08](https://github.com/zuohuadong/supacloud-1/commit/c452d08e1501aede9390aa16dd1cf95a867f5043))
* **supacloud:** sync published CLI dependencies ([#1400](https://github.com/zuohuadong/supacloud-1/issues/1400)) ([a936f66](https://github.com/zuohuadong/supacloud-1/commit/a936f66f000134a534bad9771f1d01420acc4cf7))
* **supacloud:** sync published CLI dependencies ([#1409](https://github.com/zuohuadong/supacloud-1/issues/1409)) ([405a669](https://github.com/zuohuadong/supacloud-1/commit/405a669ee9dc07e02da65f93b39a5f96d773440e))
* **supacloud:** sync published CLI dependencies ([#1415](https://github.com/zuohuadong/supacloud-1/issues/1415)) ([523a85f](https://github.com/zuohuadong/supacloud-1/commit/523a85f91a20390678859f84776b18990f1c14d3))
* **supacloud:** sync published CLI dependencies ([#1443](https://github.com/zuohuadong/supacloud-1/issues/1443)) ([ae6dbf3](https://github.com/zuohuadong/supacloud-1/commit/ae6dbf3d3d12aaebd52f7da5c769bba5d0576389))
* **supacloud:** sync published CLI dependencies ([#1446](https://github.com/zuohuadong/supacloud-1/issues/1446)) ([650261b](https://github.com/zuohuadong/supacloud-1/commit/650261b96a2c75ec6ece4386bdd3646d60e6a4ec))
* **supacloud:** sync published CLI dependencies ([#1480](https://github.com/zuohuadong/supacloud-1/issues/1480)) ([3656650](https://github.com/zuohuadong/supacloud-1/commit/36566502ee854400d91fff4ee084e84b208b4422))
* **supacloud:** sync published CLI dependencies ([#1486](https://github.com/zuohuadong/supacloud-1/issues/1486)) ([220f5e9](https://github.com/zuohuadong/supacloud-1/commit/220f5e9548d498488996b8e7f4945506f598c6d8))
* **supacloud:** sync published CLI dependencies ([#1488](https://github.com/zuohuadong/supacloud-1/issues/1488)) ([5fbffeb](https://github.com/zuohuadong/supacloud-1/commit/5fbffeb91e71aa32d057060cb50117e5013a44c8))
* **supacloud:** sync published CLI dependencies ([#1494](https://github.com/zuohuadong/supacloud-1/issues/1494)) ([5166198](https://github.com/zuohuadong/supacloud-1/commit/5166198577983ac121c9e9695c42654c8be4890c))
* **supacloud:** sync published CLI dependencies ([#1551](https://github.com/zuohuadong/supacloud-1/issues/1551)) ([235c67b](https://github.com/zuohuadong/supacloud-1/commit/235c67b4b6a26b1416a9085d405ec75a36775662))
* **supacloud:** sync published CLI dependencies ([#1591](https://github.com/zuohuadong/supacloud-1/issues/1591)) ([88f3ddb](https://github.com/zuohuadong/supacloud-1/commit/88f3ddbf710d3904e4e63d48edba938c23cd7eab))
* **supacloud:** sync published CLI dependencies ([#1597](https://github.com/zuohuadong/supacloud-1/issues/1597)) ([ed60cce](https://github.com/zuohuadong/supacloud-1/commit/ed60cced4d27e213b2547411c508098cd969afc8))
* **supacloud:** sync published CLI dependencies ([#1604](https://github.com/zuohuadong/supacloud-1/issues/1604)) ([0d16b2f](https://github.com/zuohuadong/supacloud-1/commit/0d16b2f936773e32c15f61c7b99dcde7253dbe7a))
* **supacloud:** sync published CLI dependencies ([#1611](https://github.com/zuohuadong/supacloud-1/issues/1611)) ([c9f6d0b](https://github.com/zuohuadong/supacloud-1/commit/c9f6d0bf913780664c3ed6c978d534bf4ddaafc0))
* **supacloud:** sync published CLI dependencies ([#1614](https://github.com/zuohuadong/supacloud-1/issues/1614)) ([dc06ea2](https://github.com/zuohuadong/supacloud-1/commit/dc06ea215534fb1d5a2f342c8716075235be28c0))
* **supacloud:** sync published CLI dependencies ([#1620](https://github.com/zuohuadong/supacloud-1/issues/1620)) ([149943e](https://github.com/zuohuadong/supacloud-1/commit/149943ebcab7444267ab868f21078b4c1608359b))
* **supacloud:** sync published CLI dependencies ([#1628](https://github.com/zuohuadong/supacloud-1/issues/1628)) ([3161ed1](https://github.com/zuohuadong/supacloud-1/commit/3161ed1862bde30abf4b9b8f49d12ee54bc5911c))
* **supacloud:** sync published CLI dependencies ([#1635](https://github.com/zuohuadong/supacloud-1/issues/1635)) ([1b6f9b5](https://github.com/zuohuadong/supacloud-1/commit/1b6f9b58693fdad0f1c011229e784006e904385e))
* **supacloud:** sync published CLI dependencies ([#1641](https://github.com/zuohuadong/supacloud-1/issues/1641)) ([0814213](https://github.com/zuohuadong/supacloud-1/commit/08142130e2108bb1d4dcafc2e299ea66b9da9155))
* **supacloud:** sync published CLI dependencies ([#1645](https://github.com/zuohuadong/supacloud-1/issues/1645)) ([4209311](https://github.com/zuohuadong/supacloud-1/commit/4209311d7a4b250cf2bfda768cf328ac654c6ca8))
* **supacloud:** sync published CLI dependencies ([#1649](https://github.com/zuohuadong/supacloud-1/issues/1649)) ([2875b80](https://github.com/zuohuadong/supacloud-1/commit/2875b80b9f8f4707158125b7df3ac3b1b67b4665))
* **supacloud:** sync published CLI dependencies ([#1652](https://github.com/zuohuadong/supacloud-1/issues/1652)) ([d65c4e1](https://github.com/zuohuadong/supacloud-1/commit/d65c4e133b372deb2ea365226b57f78e47a239bb))
* **supacloud:** sync published CLI dependencies ([#1659](https://github.com/zuohuadong/supacloud-1/issues/1659)) ([5f9e511](https://github.com/zuohuadong/supacloud-1/commit/5f9e5119524aa7b79a61d6c16acd4e6bbd4cfb5a))
* **supacloud:** sync published CLI dependencies ([#1685](https://github.com/zuohuadong/supacloud-1/issues/1685)) ([9a7ca96](https://github.com/zuohuadong/supacloud-1/commit/9a7ca9651046a2ab3633ad82a136a68177e97f65))
* **supacloud:** sync published CLI dependencies ([#1687](https://github.com/zuohuadong/supacloud-1/issues/1687)) ([141a939](https://github.com/zuohuadong/supacloud-1/commit/141a939bebe479a77f0189675cf1eed38f426dc5))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1179](https://github.com/zuohuadong/supacloud-1/issues/1179)) ([8f186bc](https://github.com/zuohuadong/supacloud-1/commit/8f186bc368e6ef17ed7d3e58d9429845af1bd110))
* release main ([#1189](https://github.com/zuohuadong/supacloud-1/issues/1189)) ([6754a91](https://github.com/zuohuadong/supacloud-1/commit/6754a91a68107884a7ca5d3ee6d5d54d1a450d14))
* release main ([#1199](https://github.com/zuohuadong/supacloud-1/issues/1199)) ([f374806](https://github.com/zuohuadong/supacloud-1/commit/f3748068f6f0a838b668b81a7b23f9cffd74ca37))
* release main ([#1203](https://github.com/zuohuadong/supacloud-1/issues/1203)) ([be4261f](https://github.com/zuohuadong/supacloud-1/commit/be4261f41e902323f61780fdbfea732e72493934))
* release main ([#1208](https://github.com/zuohuadong/supacloud-1/issues/1208)) ([6ff2c13](https://github.com/zuohuadong/supacloud-1/commit/6ff2c13b9ea7e3ab1a86dda3452645cd3d115c8a))
* release main ([#1225](https://github.com/zuohuadong/supacloud-1/issues/1225)) ([d6f6c78](https://github.com/zuohuadong/supacloud-1/commit/d6f6c786ef436d24ab0ab6caaabeb7a4738af552))
* release main ([#1235](https://github.com/zuohuadong/supacloud-1/issues/1235)) ([bf00a8f](https://github.com/zuohuadong/supacloud-1/commit/bf00a8f0a240d20dbd79a3cda1f8e7fca76b16c0))
* release main ([#1241](https://github.com/zuohuadong/supacloud-1/issues/1241)) ([18f84be](https://github.com/zuohuadong/supacloud-1/commit/18f84be77160d737486e9f0b2861ace91452e0f3))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1314](https://github.com/zuohuadong/supacloud-1/issues/1314)) ([0f17f04](https://github.com/zuohuadong/supacloud-1/commit/0f17f0425f9ed699da0cb6f2b0716ef0a533d647))
* release main ([#1317](https://github.com/zuohuadong/supacloud-1/issues/1317)) ([3b0a4f4](https://github.com/zuohuadong/supacloud-1/commit/3b0a4f4c93b949ddbd758966b16f9f37a817c94a))
* release main ([#1336](https://github.com/zuohuadong/supacloud-1/issues/1336)) ([22caef4](https://github.com/zuohuadong/supacloud-1/commit/22caef42e767c4b6dc7d8b0d1a04e81a3af84cbc))
* release main ([#1338](https://github.com/zuohuadong/supacloud-1/issues/1338)) ([d825368](https://github.com/zuohuadong/supacloud-1/commit/d8253681831f9641cde4301a818a50438b7e45dd))
* release main ([#1354](https://github.com/zuohuadong/supacloud-1/issues/1354)) ([3191c50](https://github.com/zuohuadong/supacloud-1/commit/3191c508ae4641c8a55a61403cd34218bbe904c2))
* release main ([#1357](https://github.com/zuohuadong/supacloud-1/issues/1357)) ([ee539ea](https://github.com/zuohuadong/supacloud-1/commit/ee539ea8f9390166047ed9404e935a4056de1141))
* release main ([#1401](https://github.com/zuohuadong/supacloud-1/issues/1401)) ([b74edee](https://github.com/zuohuadong/supacloud-1/commit/b74edeec93a4c646721e46e12ba014091d737136))
* release main ([#1410](https://github.com/zuohuadong/supacloud-1/issues/1410)) ([fffefe4](https://github.com/zuohuadong/supacloud-1/commit/fffefe4a4555d3b9f4dabff3b580c555f096fde8))
* release main ([#1413](https://github.com/zuohuadong/supacloud-1/issues/1413)) ([0b0f637](https://github.com/zuohuadong/supacloud-1/commit/0b0f637b9eed202f8aa64a3d67ad6469b468bdb9))
* release main ([#1416](https://github.com/zuohuadong/supacloud-1/issues/1416)) ([e1787e7](https://github.com/zuohuadong/supacloud-1/commit/e1787e771cbf9344feb127be95d4971b263e8b6d))
* release main ([#1445](https://github.com/zuohuadong/supacloud-1/issues/1445)) ([07ca2f4](https://github.com/zuohuadong/supacloud-1/commit/07ca2f49efc375666eb13599747c0a8962430a19))
* release main ([#1447](https://github.com/zuohuadong/supacloud-1/issues/1447)) ([50d5dec](https://github.com/zuohuadong/supacloud-1/commit/50d5deca5351b4e6f2d10929f002416ca12b4a22))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1482](https://github.com/zuohuadong/supacloud-1/issues/1482)) ([ef782af](https://github.com/zuohuadong/supacloud-1/commit/ef782afd7e281601c1444573b161c210497492e5))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1487](https://github.com/zuohuadong/supacloud-1/issues/1487)) ([e1d1ec8](https://github.com/zuohuadong/supacloud-1/commit/e1d1ec8d0596f4e8624358d006c0150ec17c95e0))
* release main ([#1489](https://github.com/zuohuadong/supacloud-1/issues/1489)) ([5c37d86](https://github.com/zuohuadong/supacloud-1/commit/5c37d86997e906392dabdab6c094d89f8d70af3c))
* release main ([#1495](https://github.com/zuohuadong/supacloud-1/issues/1495)) ([ced66da](https://github.com/zuohuadong/supacloud-1/commit/ced66dab53493e875c58f904ef0b3c26a8810928))
* release main ([#1550](https://github.com/zuohuadong/supacloud-1/issues/1550)) ([06b5266](https://github.com/zuohuadong/supacloud-1/commit/06b52667d9c23ea92053a36b0251cf93624c1014))
* release main ([#1552](https://github.com/zuohuadong/supacloud-1/issues/1552)) ([4946a66](https://github.com/zuohuadong/supacloud-1/commit/4946a6640f81ccd2c451627d44b32dbad6e28627))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1592](https://github.com/zuohuadong/supacloud-1/issues/1592)) ([224f76d](https://github.com/zuohuadong/supacloud-1/commit/224f76dfff188cf943152c3ee23cff2269d4d2b9))
* release main ([#1600](https://github.com/zuohuadong/supacloud-1/issues/1600)) ([5209a75](https://github.com/zuohuadong/supacloud-1/commit/5209a7589b785d8243be24ad3ec25a0ccdb7b42c))
* release main ([#1609](https://github.com/zuohuadong/supacloud-1/issues/1609)) ([b52c79c](https://github.com/zuohuadong/supacloud-1/commit/b52c79ceda912786f1299ae2d618172f9252607a))
* release main ([#1613](https://github.com/zuohuadong/supacloud-1/issues/1613)) ([ffac151](https://github.com/zuohuadong/supacloud-1/commit/ffac1515049ee05af290bed345dfd197b1142a27))
* release main ([#1617](https://github.com/zuohuadong/supacloud-1/issues/1617)) ([afad389](https://github.com/zuohuadong/supacloud-1/commit/afad38960cf086afeddcdc4565daa7b8cb429c2e))
* release main ([#1626](https://github.com/zuohuadong/supacloud-1/issues/1626)) ([2fe1c18](https://github.com/zuohuadong/supacloud-1/commit/2fe1c187866dd5ba1c1d414f4a7f8b25923209b7))
* release main ([#1631](https://github.com/zuohuadong/supacloud-1/issues/1631)) ([63b75e9](https://github.com/zuohuadong/supacloud-1/commit/63b75e93da97a5cb11b404bb1202cbc30dc90eec))
* release main ([#1638](https://github.com/zuohuadong/supacloud-1/issues/1638)) ([1857d39](https://github.com/zuohuadong/supacloud-1/commit/1857d39b2639e5ddf8f0a671b4167ba9c2f15c39))
* release main ([#1642](https://github.com/zuohuadong/supacloud-1/issues/1642)) ([2c2de43](https://github.com/zuohuadong/supacloud-1/commit/2c2de431073a6097f7589bc8b2f413508aec82b4))
* release main ([#1647](https://github.com/zuohuadong/supacloud-1/issues/1647)) ([9afdb5c](https://github.com/zuohuadong/supacloud-1/commit/9afdb5c348a2e87169e8898b3842091bb8f1ddea))
* release main ([#1651](https://github.com/zuohuadong/supacloud-1/issues/1651)) ([2e9cb18](https://github.com/zuohuadong/supacloud-1/commit/2e9cb185d6938c5b38fa8279fb9f131bac87d8f3))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1661](https://github.com/zuohuadong/supacloud-1/issues/1661)) ([77ea3fa](https://github.com/zuohuadong/supacloud-1/commit/77ea3fa73707222f21561005a6be3569dae606b4))
* release main ([#1668](https://github.com/zuohuadong/supacloud-1/issues/1668)) ([a7ce18b](https://github.com/zuohuadong/supacloud-1/commit/a7ce18b73e0a2e93df664fb8da08cd40f3bdae82))
* release main ([#1686](https://github.com/zuohuadong/supacloud-1/issues/1686)) ([843b076](https://github.com/zuohuadong/supacloud-1/commit/843b076178052aaa700543c9deced02f6091178c))
* release main ([#1688](https://github.com/zuohuadong/supacloud-1/issues/1688)) ([2d01391](https://github.com/zuohuadong/supacloud-1/commit/2d01391b3b8fac5dcce1a15f4749f720c0aa6562))
</details>

<details><summary>contracts: 0.9.0</summary>

## [0.9.0](https://github.com/zuohuadong/supacloud-1/compare/contracts-v0.8.0...contracts-v0.9.0) (2026-10-31)


###   BREAKING CHANGES

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
</details>

<details><summary>commands: 0.10.0</summary>

## [0.10.0](https://github.com/zuohuadong/supacloud-1/compare/commands-v0.9.1...commands-v0.10.0) (2026-10-31)


###   BREAKING CHANGES

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
</details>

<details><summary>app-svelte: 0.6.0</summary>

## [0.6.0](https://github.com/zuohuadong/supacloud-1/compare/app-svelte-v0.5.0...app-svelte-v0.6.0) (2026-10-31)


###   BREAKING CHANGES

* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* freeze authored type-safety merge gate ([25e07ea](https://github.com/zuohuadong/supacloud-1/commit/25e07ea1de16cc01a24ed6f001b9bdc729b5ee5e))
* **supacloud-js:** add framework-neutral TanStack Query adapter ([#1637](https://github.com/zuohuadong/supacloud-1/issues/1637)) ([071b28c](https://github.com/zuohuadong/supacloud-1/commit/071b28c5ce992834f46a0608d68475eb295c5c3e))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1249](https://github.com/zuohuadong/supacloud-1/issues/1249)) ([76c2d14](https://github.com/zuohuadong/supacloud-1/commit/76c2d14ab9127c4150909af778eb92e969f30e7a))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1638](https://github.com/zuohuadong/supacloud-1/issues/1638)) ([1857d39](https://github.com/zuohuadong/supacloud-1/commit/1857d39b2639e5ddf8f0a671b4167ba9c2f15c39))
</details>

<details><summary>app: 0.24.0</summary>

## [0.24.0](https://github.com/zuohuadong/supacloud-1/compare/app-v0.23.0...app-v0.24.0) (2026-10-31)


###   BREAKING CHANGES

* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* add statically compiled AOP boundaries and jobs ([#1160](https://github.com/zuohuadong/supacloud-1/issues/1160)) ([66c962a](https://github.com/zuohuadong/supacloud-1/commit/66c962a923ed6c4dbd3a354715346878793bb14c))
* add SupAuth identity and FA-driven command governance ([#1220](https://github.com/zuohuadong/supacloud-1/issues/1220)) ([66a77ca](https://github.com/zuohuadong/supacloud-1/commit/66a77caea086bb1282772dd9401bd2adb9c04342))
* **app:** add browser-safe HTTP entrypoint ([#1299](https://github.com/zuohuadong/supacloud-1/issues/1299)) ([dc5c380](https://github.com/zuohuadong/supacloud-1/commit/dc5c38027141d0c4888ce7860d04efda79f19043))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **app:** add portable execution pipeline for Elysia 2 beta ([#1506](https://github.com/zuohuadong/supacloud-1/issues/1506)) ([02486f4](https://github.com/zuohuadong/supacloud-1/commit/02486f43a12d6260cbcabde305857fb92464529a))
* **app:** enforce typed reactive form writes ([#1372](https://github.com/zuohuadong/supacloud-1/issues/1372)) ([5f76ea8](https://github.com/zuohuadong/supacloud-1/commit/5f76ea818a94641c6cac7d55a3b46ce6a47dac7e))
* **app:** provide zero-config project defaults ([#1173](https://github.com/zuohuadong/supacloud-1/issues/1173)) ([489824d](https://github.com/zuohuadong/supacloud-1/commit/489824db5137e4675248cfc789d9d86e8139775e))
* **app:** validate HTTP contracts and require route declarations ([#1201](https://github.com/zuohuadong/supacloud-1/issues/1201)) ([6fc047b](https://github.com/zuohuadong/supacloud-1/commit/6fc047b2349bc04fbbe0ff134558d6e45dc275eb))
* **architecture:** enforce compile-time application governance ([#1301](https://github.com/zuohuadong/supacloud-1/issues/1301)) ([b2c1df2](https://github.com/zuohuadong/supacloud-1/commit/b2c1df25294d0195ddf313623b965e599847d9f9))
* **cli:** add governed application starter ([#1193](https://github.com/zuohuadong/supacloud-1/issues/1193)) ([f33561b](https://github.com/zuohuadong/supacloud-1/commit/f33561bfb05e0a63ce08de0153a4fa95f02ac2d6))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* **compiler:** add validated application resource model ([#1512](https://github.com/zuohuadong/supacloud-1/issues/1512)) ([c7ed93b](https://github.com/zuohuadong/supacloud-1/commit/c7ed93b5cd50107ba0c61ac002e1c254907aa6a5))
* **compiler:** preserve raw body and wildcard transport contracts ([#1442](https://github.com/zuohuadong/supacloud-1/issues/1442)) ([436146d](https://github.com/zuohuadong/supacloud-1/commit/436146d0f7f74be1c53969a2fc4854b59976d01d))
* complete Angular framework defaults integration ([#1587](https://github.com/zuohuadong/supacloud-1/issues/1587)) ([0dec8ea](https://github.com/zuohuadong/supacloud-1/commit/0dec8ea48f288da27824579038136dd33f8ccb20))
* complete compiler runtime roadmap ([cb4618a](https://github.com/zuohuadong/supacloud-1/commit/cb4618aef455853f7ad408f06d67004d49155ffb))
* converge SDK-aware vibecoding defaults and local development ([#1607](https://github.com/zuohuadong/supacloud-1/issues/1607)) ([cd66672](https://github.com/zuohuadong/supacloud-1/commit/cd6667252a6a8fe0cc0539bc8610ebb8a818af51))
* default RxJS support with compatible SupaCloud JS calls ([#1556](https://github.com/zuohuadong/supacloud-1/issues/1556)) ([b3015cb](https://github.com/zuohuadong/supacloud-1/commit/b3015cb161c0d87e6611f6c4fc60c120a8c9fffe))
* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/zuohuadong/supacloud-1/issues/1654)) ([39ee49f](https://github.com/zuohuadong/supacloud-1/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))
* **framework:** centralize command runtime governance contract ([#1341](https://github.com/zuohuadong/supacloud-1/issues/1341)) ([2d7e795](https://github.com/zuohuadong/supacloud-1/commit/2d7e79595af64c8fbe95a5e754dedcd0a825a282))
* **framework:** complete schema-first route contracts ([#1304](https://github.com/zuohuadong/supacloud-1/issues/1304)) ([4acc3ac](https://github.com/zuohuadong/supacloud-1/commit/4acc3aced2b6e3202705dd87071131af631abad2))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))


### Bug Fixes

* **app:** harden lifecycle ordering and preserve cleanup failures ([#1555](https://github.com/zuohuadong/supacloud-1/issues/1555)) ([8c96e0d](https://github.com/zuohuadong/supacloud-1/commit/8c96e0d516bd655178ee26f05777787f4e511dab))
* **app:** isolate initialization and guarantee shutdown cleanup ([#1300](https://github.com/zuohuadong/supacloud-1/issues/1300)) ([d16c179](https://github.com/zuohuadong/supacloud-1/commit/d16c17990161c016b0072380e8888a57b1663986))
* **compiler:** close job scope review gaps ([#1161](https://github.com/zuohuadong/supacloud-1/issues/1161)) ([2784942](https://github.com/zuohuadong/supacloud-1/commit/278494285d6225d98619e3df76071418539894e6))
* **elysia:** return 503 when pending work admission is full ([#1594](https://github.com/zuohuadong/supacloud-1/issues/1594)) ([a1e5d2e](https://github.com/zuohuadong/supacloud-1/commit/a1e5d2e9e023a45f852ae7b278509913f0c50e1e))


### Elegance & Refactoring

* use ESM-only owned packages and Lite launcher ([#1582](https://github.com/zuohuadong/supacloud-1/issues/1582)) ([ed5ac78](https://github.com/zuohuadong/supacloud-1/commit/ed5ac78ee3ab22567268fa276e5b016ad1e8b575))


### Performance Improvements

* optimize compiler and upgrade Bun runtime ([#1283](https://github.com/zuohuadong/supacloud-1/issues/1283)) ([381c1b9](https://github.com/zuohuadong/supacloud-1/commit/381c1b98264a563d22fc2f4af85f7f7117563481))


### Documentation

* add bilingual Chinese and English documentation for MCP AI operations, observability, and backup recovery ([#1187](https://github.com/zuohuadong/supacloud-1/issues/1187)) ([d98b061](https://github.com/zuohuadong/supacloud-1/commit/d98b0612ea6c16753251f3c45dbc86cd0968c42c))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1162](https://github.com/zuohuadong/supacloud-1/issues/1162)) ([df72d07](https://github.com/zuohuadong/supacloud-1/commit/df72d07f6fc025c759145d5fef8d0189e8a801f4))
* release main ([#1176](https://github.com/zuohuadong/supacloud-1/issues/1176)) ([c04a50d](https://github.com/zuohuadong/supacloud-1/commit/c04a50df7df76408208429587970fd1e66ffc789))
* release main ([#1183](https://github.com/zuohuadong/supacloud-1/issues/1183)) ([07ca38e](https://github.com/zuohuadong/supacloud-1/commit/07ca38e6db6c66a2b60f601a6561f65b2a99e65f))
* release main ([#1189](https://github.com/zuohuadong/supacloud-1/issues/1189)) ([6754a91](https://github.com/zuohuadong/supacloud-1/commit/6754a91a68107884a7ca5d3ee6d5d54d1a450d14))
* release main ([#1194](https://github.com/zuohuadong/supacloud-1/issues/1194)) ([7d0eb27](https://github.com/zuohuadong/supacloud-1/commit/7d0eb27ec8b118321e9085aff6cd9f77a2eec642))
* release main ([#1203](https://github.com/zuohuadong/supacloud-1/issues/1203)) ([be4261f](https://github.com/zuohuadong/supacloud-1/commit/be4261f41e902323f61780fdbfea732e72493934))
* release main ([#1221](https://github.com/zuohuadong/supacloud-1/issues/1221)) ([254364e](https://github.com/zuohuadong/supacloud-1/commit/254364e9b29bcf873773ef0e54017422e7889a0c))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1284](https://github.com/zuohuadong/supacloud-1/issues/1284)) ([b347a92](https://github.com/zuohuadong/supacloud-1/commit/b347a92b0b4bcfd00b3ee23d22fa17d77225b689))
* release main ([#1298](https://github.com/zuohuadong/supacloud-1/issues/1298)) ([2011f2d](https://github.com/zuohuadong/supacloud-1/commit/2011f2dfddc277dee1d9f7b2a87fd8d96b7cfab6))
* release main ([#1303](https://github.com/zuohuadong/supacloud-1/issues/1303)) ([7cf5889](https://github.com/zuohuadong/supacloud-1/commit/7cf588922e5081926e34ae8b2438634e0ea16c2a))
* release main ([#1351](https://github.com/zuohuadong/supacloud-1/issues/1351)) ([5e27d1a](https://github.com/zuohuadong/supacloud-1/commit/5e27d1af135d154aa4dc924910bf8204a02942ae))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1431](https://github.com/zuohuadong/supacloud-1/issues/1431)) ([b7255e6](https://github.com/zuohuadong/supacloud-1/commit/b7255e6fbb277e0fdcbbe7cfeacc81cee62f7fe2))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1507](https://github.com/zuohuadong/supacloud-1/issues/1507)) ([b7f3a59](https://github.com/zuohuadong/supacloud-1/commit/b7f3a59885596742a8b11fc808d898165a8989ec))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1586](https://github.com/zuohuadong/supacloud-1/issues/1586)) ([21f22d8](https://github.com/zuohuadong/supacloud-1/commit/21f22d8dba3a1e6e704865727ed5ff4095d28eac))
* release main ([#1592](https://github.com/zuohuadong/supacloud-1/issues/1592)) ([224f76d](https://github.com/zuohuadong/supacloud-1/commit/224f76dfff188cf943152c3ee23cff2269d4d2b9))
* release main ([#1609](https://github.com/zuohuadong/supacloud-1/issues/1609)) ([b52c79c](https://github.com/zuohuadong/supacloud-1/commit/b52c79ceda912786f1299ae2d618172f9252607a))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
</details>

<details><summary>delivery: 0.9.0</summary>

## [0.9.0](https://github.com/zuohuadong/supacloud-1/compare/delivery-v0.8.0...delivery-v0.9.0) (2026-10-31)


### Features

* add agent backend authoring, runtime and observability workflows ([#1648](https://github.com/zuohuadong/supacloud-1/issues/1648)) ([59a66d1](https://github.com/zuohuadong/supacloud-1/commit/59a66d184a47d19c7f8895f24a6ba2c7e74e93d0))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **delivery:** add single-node deployment evidence contract ([781dbac](https://github.com/zuohuadong/supacloud-1/commit/781dbacab6ea6d1cab93ecb3b9674dd325daa99c))
* establish single-node delivery baseline ([#1632](https://github.com/zuohuadong/supacloud-1/issues/1632)) ([926de6c](https://github.com/zuohuadong/supacloud-1/commit/926de6c6c72940f7c03e046908ef446c54d37621))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* **management-api:** Developer MCP reads application development context (P1-4) ([#1519](https://github.com/zuohuadong/supacloud-1/issues/1519)) ([7d7f0e9](https://github.com/zuohuadong/supacloud-1/commit/7d7f0e9d1d3263614fb1104c3168521e21b69832))
* **worker:** add bounded runtime recipes and native adapter ([#1618](https://github.com/zuohuadong/supacloud-1/issues/1618)) ([335354c](https://github.com/zuohuadong/supacloud-1/commit/335354c988e63f7c58ff79d7210a9af20814e911))
* **worker:** bounded execution groups and admission controls ([#1616](https://github.com/zuohuadong/supacloud-1/issues/1616)) ([8d870ea](https://github.com/zuohuadong/supacloud-1/commit/8d870eabfce9bedce75d42151f5085bcef19b4c1))


### Bug Fixes

* **worker:** enforce safe retirement and admission grants ([6ac69dc](https://github.com/zuohuadong/supacloud-1/commit/6ac69dcb3381c47a5f91737b958f3a730f4304f9))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1507](https://github.com/zuohuadong/supacloud-1/issues/1507)) ([b7f3a59](https://github.com/zuohuadong/supacloud-1/commit/b7f3a59885596742a8b11fc808d898165a8989ec))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1617](https://github.com/zuohuadong/supacloud-1/issues/1617)) ([afad389](https://github.com/zuohuadong/supacloud-1/commit/afad38960cf086afeddcdc4565daa7b8cb429c2e))
* release main ([#1623](https://github.com/zuohuadong/supacloud-1/issues/1623)) ([f68e24d](https://github.com/zuohuadong/supacloud-1/commit/f68e24d942ddb71342eb80bef1c78015b4c2b079))
* release main ([#1633](https://github.com/zuohuadong/supacloud-1/issues/1633)) ([e9db823](https://github.com/zuohuadong/supacloud-1/commit/e9db823b47db6b0d9ebe8057792e35e34c144420))
* release main ([#1647](https://github.com/zuohuadong/supacloud-1/issues/1647)) ([9afdb5c](https://github.com/zuohuadong/supacloud-1/commit/9afdb5c348a2e87169e8898b3842091bb8f1ddea))
</details>

<details><summary>compiler: 0.40.0</summary>

## [0.40.0](https://github.com/zuohuadong/supacloud-1/compare/compiler-v0.39.0...compiler-v0.40.0) (2026-10-31)


###   BREAKING CHANGES

* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.
* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* add agent backend authoring, runtime and observability workflows ([#1648](https://github.com/zuohuadong/supacloud-1/issues/1648)) ([59a66d1](https://github.com/zuohuadong/supacloud-1/commit/59a66d184a47d19c7f8895f24a6ba2c7e74e93d0))
* add statically compiled AOP boundaries and jobs ([#1160](https://github.com/zuohuadong/supacloud-1/issues/1160)) ([66c962a](https://github.com/zuohuadong/supacloud-1/commit/66c962a923ed6c4dbd3a354715346878793bb14c))
* add Supabase-compatible procedure client transport ([#1634](https://github.com/zuohuadong/supacloud-1/issues/1634)) ([661351a](https://github.com/zuohuadong/supacloud-1/commit/661351ae507877a463a5aab1bd49a27c9bd77cfa))
* add SupAuth identity and FA-driven command governance ([#1220](https://github.com/zuohuadong/supacloud-1/issues/1220)) ([66a77ca](https://github.com/zuohuadong/supacloud-1/commit/66a77caea086bb1282772dd9401bd2adb9c04342))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **app:** provide zero-config project defaults ([#1173](https://github.com/zuohuadong/supacloud-1/issues/1173)) ([489824d](https://github.com/zuohuadong/supacloud-1/commit/489824db5137e4675248cfc789d9d86e8139775e))
* **app:** validate HTTP contracts and require route declarations ([#1201](https://github.com/zuohuadong/supacloud-1/issues/1201)) ([6fc047b](https://github.com/zuohuadong/supacloud-1/commit/6fc047b2349bc04fbbe0ff134558d6e45dc275eb))
* **architecture:** enforce compile-time application governance ([#1301](https://github.com/zuohuadong/supacloud-1/issues/1301)) ([b2c1df2](https://github.com/zuohuadong/supacloud-1/commit/b2c1df25294d0195ddf313623b965e599847d9f9))
* **cli:** add governed application starter ([#1193](https://github.com/zuohuadong/supacloud-1/issues/1193)) ([f33561b](https://github.com/zuohuadong/supacloud-1/commit/f33561bfb05e0a63ce08de0153a4fa95f02ac2d6))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* **compiler,query,supacloud-js:** procedure façade, supabase-js compatibility, and @supacloud/query adapter ([#1653](https://github.com/zuohuadong/supacloud-1/issues/1653)) ([8ed8d1a](https://github.com/zuohuadong/supacloud-1/commit/8ed8d1ad594ab981e6d03333ad35248608467992))
* **compiler:** add application development context contract (P1-4) ([#1516](https://github.com/zuohuadong/supacloud-1/issues/1516)) ([8bf40fc](https://github.com/zuohuadong/supacloud-1/commit/8bf40fc5988aaf075c7c3d8a319798bb11e366fd))
* **compiler:** add business execution timeline to execution context (P0-3) ([#1515](https://github.com/zuohuadong/supacloud-1/issues/1515)) ([0ec5ace](https://github.com/zuohuadong/supacloud-1/commit/0ec5ace9c5be047a8b73b1da6ed58a5a55ab687b))
* **compiler:** add database-first GraphQL query contracts ([#1224](https://github.com/zuohuadong/supacloud-1/issues/1224)) ([a10e0d5](https://github.com/zuohuadong/supacloud-1/commit/a10e0d54f87bee79c0a3a34f9b8685a994eb444b))
* **compiler:** add line-ending-normalized GraphQL schema diagnostics ([#1595](https://github.com/zuohuadong/supacloud-1/issues/1595)) ([5aa4ec5](https://github.com/zuohuadong/supacloud-1/commit/5aa4ec50a82fbf1b0a22b051039516ab5e46cf9c))
* **compiler:** add local delivery planning and independent builds ([#1245](https://github.com/zuohuadong/supacloud-1/issues/1245)) ([fd860ac](https://github.com/zuohuadong/supacloud-1/commit/fd860ac82834f28df733ca5c91f3a3314a8ca748))
* **compiler:** add migration guardrails without SSR requirement ([07e4e29](https://github.com/zuohuadong/supacloud-1/commit/07e4e2949eebad87c2dcc7f94b34a132a46993f3))
* **compiler:** add validated application resource model ([#1512](https://github.com/zuohuadong/supacloud-1/issues/1512)) ([c7ed93b](https://github.com/zuohuadong/supacloud-1/commit/c7ed93b5cd50107ba0c61ac002e1c254907aa6a5))
* **compiler:** configure command capabilities ([#1178](https://github.com/zuohuadong/supacloud-1/issues/1178)) ([ccac0b6](https://github.com/zuohuadong/supacloud-1/commit/ccac0b6b4fb709eca57de4fbcdc5b76109226976))
* **compiler:** diagnose browser-unsafe client schemas ([#1679](https://github.com/zuohuadong/supacloud-1/issues/1679)) ([18582fc](https://github.com/zuohuadong/supacloud-1/commit/18582fcc0384246d87660cb42b6b4acbdc475b5e))
* **compiler:** emit a unified contract manifest ([#1369](https://github.com/zuohuadong/supacloud-1/issues/1369)) ([db56a95](https://github.com/zuohuadong/supacloud-1/commit/db56a95691a898afa7a948533edea5095c1d3820))
* **compiler:** preserve raw body and wildcard transport contracts ([#1442](https://github.com/zuohuadong/supacloud-1/issues/1442)) ([436146d](https://github.com/zuohuadong/supacloud-1/commit/436146d0f7f74be1c53969a2fc4854b59976d01d))
* **compiler:** resolve bounded per-environment resource bindings ([#1523](https://github.com/zuohuadong/supacloud-1/issues/1523)) ([3305d61](https://github.com/zuohuadong/supacloud-1/commit/3305d618be63da23945a537715632760c67784df))
* **compiler:** ship validated development contexts in delivery builds ([#1518](https://github.com/zuohuadong/supacloud-1/issues/1518)) ([70f944b](https://github.com/zuohuadong/supacloud-1/commit/70f944b3b4f48b265158dfdaf9fbe91878445498))
* **compiler:** validate complete local runtime bindings before bounded projection ([#1526](https://github.com/zuohuadong/supacloud-1/issues/1526)) ([9b085eb](https://github.com/zuohuadong/supacloud-1/commit/9b085ebd67a79023d0d6f1a44508617fa86b1971))
* **compiler:** validate GraphQL results and expose governance config ([#1232](https://github.com/zuohuadong/supacloud-1/issues/1232)) ([a238d56](https://github.com/zuohuadong/supacloud-1/commit/a238d564050ba2927da426781377ce7d5bb30ab3))
* **compiler:** verify immutable release evidence without executing project configuration ([#1525](https://github.com/zuohuadong/supacloud-1/issues/1525)) ([ab9ac43](https://github.com/zuohuadong/supacloud-1/commit/ab9ac436a5cffe13ff46e8afe00d152ba17e2a54))
* complete Angular framework defaults integration ([#1587](https://github.com/zuohuadong/supacloud-1/issues/1587)) ([0dec8ea](https://github.com/zuohuadong/supacloud-1/commit/0dec8ea48f288da27824579038136dd33f8ccb20))
* complete compile-time database architecture ([#1332](https://github.com/zuohuadong/supacloud-1/issues/1332)) ([4a82b4b](https://github.com/zuohuadong/supacloud-1/commit/4a82b4b89078ef371029c6d18b7c674086627a88))
* complete compiler runtime roadmap ([cb4618a](https://github.com/zuohuadong/supacloud-1/commit/cb4618aef455853f7ad408f06d67004d49155ffb))
* default RxJS support with compatible SupaCloud JS calls ([#1556](https://github.com/zuohuadong/supacloud-1/issues/1556)) ([b3015cb](https://github.com/zuohuadong/supacloud-1/commit/b3015cb161c0d87e6611f6c4fc60c120a8c9fffe))
* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/zuohuadong/supacloud-1/issues/1654)) ([39ee49f](https://github.com/zuohuadong/supacloud-1/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))
* **elysia:** preserve static DI and add native HTTP policy suite ([#1441](https://github.com/zuohuadong/supacloud-1/issues/1441)) ([6a34a55](https://github.com/zuohuadong/supacloud-1/commit/6a34a551aa42c18ffbeda8f57b791373c67b83d2))
* **framework:** add command composition and recovery observability ([#1432](https://github.com/zuohuadong/supacloud-1/issues/1432)) ([456efcd](https://github.com/zuohuadong/supacloud-1/commit/456efcd807deabeb3f3df6d718c47c427673b1f5))
* **framework:** add OpenAPI generation and typed worker execution ([#1286](https://github.com/zuohuadong/supacloud-1/issues/1286)) ([25dcffb](https://github.com/zuohuadong/supacloud-1/commit/25dcffb9a7a33ee7205868c860126d3d2ef50ff4))
* **framework:** complete schema-first route contracts ([#1304](https://github.com/zuohuadong/supacloud-1/issues/1304)) ([4acc3ac](https://github.com/zuohuadong/supacloud-1/commit/4acc3aced2b6e3202705dd87071131af631abad2))
* **framework:** improve vibecoding development workflow ([#1430](https://github.com/zuohuadong/supacloud-1/issues/1430)) ([7bd35ff](https://github.com/zuohuadong/supacloud-1/commit/7bd35ff216fd276f10643f0f13ae217375badc76))
* **framework:** make command governance default ([#1342](https://github.com/zuohuadong/supacloud-1/issues/1342)) ([5ef7362](https://github.com/zuohuadong/supacloud-1/commit/5ef7362ea0bd9f260576b7ecc4c7eef71aa752b4))
* **framework:** runtime acceptance and versioned upgrade gates ([#1318](https://github.com/zuohuadong/supacloud-1/issues/1318)) ([69dfba4](https://github.com/zuohuadong/supacloud-1/commit/69dfba4f44ca3bd9a35b8a5f6fca91d61c9c2f0b))
* **graphql:** add compatibility governance pack ([24c58dc](https://github.com/zuohuadong/supacloud-1/commit/24c58dcc2a5ae94e15065297be38d37d0941ed43))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* **lite:** align runtime contracts and support real pg_graphql ([#1231](https://github.com/zuohuadong/supacloud-1/issues/1231)) ([9dec0ce](https://github.com/zuohuadong/supacloud-1/commit/9dec0ceca8f0457cd8f514506c4660b5148226b3))
* **management-api:** Developer MCP reads application development context (P1-4) ([#1519](https://github.com/zuohuadong/supacloud-1/issues/1519)) ([7d7f0e9](https://github.com/zuohuadong/supacloud-1/commit/7d7f0e9d1d3263614fb1104c3168521e21b69832))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))
* **supacloud-js:** add framework-neutral TanStack Query adapter ([#1637](https://github.com/zuohuadong/supacloud-1/issues/1637)) ([071b28c](https://github.com/zuohuadong/supacloud-1/commit/071b28c5ce992834f46a0608d68475eb295c5c3e))
* **supacloud-js:** add typed procedure facade and unified errors ([#1639](https://github.com/zuohuadong/supacloud-1/issues/1639)) ([fef05e9](https://github.com/zuohuadong/supacloud-1/commit/fef05e98ee1044e1f449bad52d18104d28e17cb4))
* **worker:** bounded execution groups and admission controls ([#1616](https://github.com/zuohuadong/supacloud-1/issues/1616)) ([8d870ea](https://github.com/zuohuadong/supacloud-1/commit/8d870eabfce9bedce75d42151f5085bcef19b4c1))


### Bug Fixes

* **compiler:** align migration dependency pin with released elysia 0.15.0 ([#1324](https://github.com/zuohuadong/supacloud-1/issues/1324)) ([459ee84](https://github.com/zuohuadong/supacloud-1/commit/459ee840ade78b7f5891a678ef8ccbdd29631a30))
* **compiler:** avoid duplicate GraphQL enum and input types ([#1228](https://github.com/zuohuadong/supacloud-1/issues/1228)) ([9054c41](https://github.com/zuohuadong/supacloud-1/commit/9054c417b3e16c2d265ea2839f4aa72f9a64f513))
* **compiler:** classify TypeBox opacity at schema boundaries ([#1471](https://github.com/zuohuadong/supacloud-1/issues/1471)) ([ca4ba73](https://github.com/zuohuadong/supacloud-1/commit/ca4ba733c1ac885f6bd52fda8c68afe8c4df792a))
* **compiler:** close job scope review gaps ([#1161](https://github.com/zuohuadong/supacloud-1/issues/1161)) ([2784942](https://github.com/zuohuadong/supacloud-1/commit/278494285d6225d98619e3df76071418539894e6))
* **compiler:** compose generated clients with frontend SDK auth ([#1603](https://github.com/zuohuadong/supacloud-1/issues/1603)) ([7b14968](https://github.com/zuohuadong/supacloud-1/commit/7b1496828a9ade663f2a3d4572252af966296763))
* **compiler:** harden execution and development context projections ([#1517](https://github.com/zuohuadong/supacloud-1/issues/1517)) ([822e902](https://github.com/zuohuadong/supacloud-1/commit/822e9026bead5cee9006c83a3f5bfa45cf59c3ed))
* **compiler:** keep generated runtime types strict ([#1682](https://github.com/zuohuadong/supacloud-1/issues/1682)) ([ad319f9](https://github.com/zuohuadong/supacloud-1/commit/ad319f9614c328a5d0f69d581dd55600fd8dfcf7))
* **compiler:** preserve controller prefix params and route titles ([#1439](https://github.com/zuohuadong/supacloud-1/issues/1439)) ([0c62a1f](https://github.com/zuohuadong/supacloud-1/commit/0c62a1fcb784aa4ee43a952323d3126bde7c0e0b))
* **compiler:** preserve platform dependencies across scoped factories ([#1440](https://github.com/zuohuadong/supacloud-1/issues/1440)) ([6786563](https://github.com/zuohuadong/supacloud-1/commit/67865631fe4dc8d78a2d5fda5d15c0271e07120d))
* **compiler:** preserve TypeBox module refs and recursive client contracts ([#1464](https://github.com/zuohuadong/supacloud-1/issues/1464)) ([459b9e6](https://github.com/zuohuadong/supacloud-1/commit/459b9e6bf9c010c0bedc1ab9a5cd3b8bae62179f))
* **compiler:** resolve migration dependency pin lazily ([#1327](https://github.com/zuohuadong/supacloud-1/issues/1327)) ([e36a094](https://github.com/zuohuadong/supacloud-1/commit/e36a094051107948a60cabe582f7a3662143d98c))
* **compiler:** validate generated client responses ([#1171](https://github.com/zuohuadong/supacloud-1/issues/1171)) ([6a4f673](https://github.com/zuohuadong/supacloud-1/commit/6a4f6730ab9a255c8b82ca2babdbdd8941fe370c))
* **deps,perf:** replace Bun native APIs and resolve audit vulnerabilities ([#1667](https://github.com/zuohuadong/supacloud-1/issues/1667)) ([06a9199](https://github.com/zuohuadong/supacloud-1/commit/06a91990c754ce586f2a2353f253dc50f4fa0f98))
* **dev:** repair watch lifecycle and development reports ([#1524](https://github.com/zuohuadong/supacloud-1/issues/1524)) ([69fd216](https://github.com/zuohuadong/supacloud-1/commit/69fd216cbeb3bc68ca182d488bc86e8061283468))
* **elysia:** recognize only Elysia status() responses ([#1307](https://github.com/zuohuadong/supacloud-1/issues/1307)) ([b3fa60c](https://github.com/zuohuadong/supacloud-1/commit/b3fa60c41ec71ef703c939f9d7bd5c38791750e1))
* **release:** keep compiler migration tuple in sync with elysia/app releases ([#1674](https://github.com/zuohuadong/supacloud-1/issues/1674)) ([a072c7d](https://github.com/zuohuadong/supacloud-1/commit/a072c7dbf4a6a313f7fb092256b9c3baa3b00318))
* **supacloud-js:** harden procedure execution contracts ([#1643](https://github.com/zuohuadong/supacloud-1/issues/1643)) ([cb20731](https://github.com/zuohuadong/supacloud-1/commit/cb20731961525ee02e8d46467bf45e9b3dbd9147))


### Performance Improvements

* **compiler,web-console:** optimize I/O with Bun APIs, Vite pre-bundling, and graph algorithms ([#1246](https://github.com/zuohuadong/supacloud-1/issues/1246)) ([1db9458](https://github.com/zuohuadong/supacloud-1/commit/1db9458bb620c32476597c5bf795d00e63700559))


### Documentation

* complete compile-time architecture usage guides ([#1333](https://github.com/zuohuadong/supacloud-1/issues/1333)) ([3190178](https://github.com/zuohuadong/supacloud-1/commit/319017810deb4d7c9911f1bd001ca898f9ea9982))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** complete @sinclair/typebox to typebox 1.3.34 migration ([#1655](https://github.com/zuohuadong/supacloud-1/issues/1655)) ([87d1133](https://github.com/zuohuadong/supacloud-1/commit/87d1133c0fa0eadf145afc6c3747f693e3e36200))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([3d041a4](https://github.com/zuohuadong/supacloud-1/commit/3d041a4f2d7d6f29a9160f2c32bea959df72f5d4))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1162](https://github.com/zuohuadong/supacloud-1/issues/1162)) ([df72d07](https://github.com/zuohuadong/supacloud-1/commit/df72d07f6fc025c759145d5fef8d0189e8a801f4))
* release main ([#1172](https://github.com/zuohuadong/supacloud-1/issues/1172)) ([b542d86](https://github.com/zuohuadong/supacloud-1/commit/b542d86f31bc2c390751924706b3cd3bd8a2c8b9))
* release main ([#1176](https://github.com/zuohuadong/supacloud-1/issues/1176)) ([c04a50d](https://github.com/zuohuadong/supacloud-1/commit/c04a50df7df76408208429587970fd1e66ffc789))
* release main ([#1179](https://github.com/zuohuadong/supacloud-1/issues/1179)) ([8f186bc](https://github.com/zuohuadong/supacloud-1/commit/8f186bc368e6ef17ed7d3e58d9429845af1bd110))
* release main ([#1183](https://github.com/zuohuadong/supacloud-1/issues/1183)) ([07ca38e](https://github.com/zuohuadong/supacloud-1/commit/07ca38e6db6c66a2b60f601a6561f65b2a99e65f))
* release main ([#1194](https://github.com/zuohuadong/supacloud-1/issues/1194)) ([7d0eb27](https://github.com/zuohuadong/supacloud-1/commit/7d0eb27ec8b118321e9085aff6cd9f77a2eec642))
* release main ([#1203](https://github.com/zuohuadong/supacloud-1/issues/1203)) ([be4261f](https://github.com/zuohuadong/supacloud-1/commit/be4261f41e902323f61780fdbfea732e72493934))
* release main ([#1221](https://github.com/zuohuadong/supacloud-1/issues/1221)) ([254364e](https://github.com/zuohuadong/supacloud-1/commit/254364e9b29bcf873773ef0e54017422e7889a0c))
* release main ([#1225](https://github.com/zuohuadong/supacloud-1/issues/1225)) ([d6f6c78](https://github.com/zuohuadong/supacloud-1/commit/d6f6c786ef436d24ab0ab6caaabeb7a4738af552))
* release main ([#1229](https://github.com/zuohuadong/supacloud-1/issues/1229)) ([fef9f3a](https://github.com/zuohuadong/supacloud-1/commit/fef9f3aa7ee93628e2e7a56e4dc57a476bbc203d))
* release main ([#1233](https://github.com/zuohuadong/supacloud-1/issues/1233)) ([1eb95cc](https://github.com/zuohuadong/supacloud-1/commit/1eb95cc698fb59975030ab21a567bc462527a2a9))
* release main ([#1239](https://github.com/zuohuadong/supacloud-1/issues/1239)) ([edd8bc5](https://github.com/zuohuadong/supacloud-1/commit/edd8bc55ed26bb0dbf94b5cef9c88bdf26eb8216))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1247](https://github.com/zuohuadong/supacloud-1/issues/1247)) ([b21ffe3](https://github.com/zuohuadong/supacloud-1/commit/b21ffe3dfec4d8513dfcb1ff59092b4f89ff344f))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1287](https://github.com/zuohuadong/supacloud-1/issues/1287)) ([99688d6](https://github.com/zuohuadong/supacloud-1/commit/99688d69245cb881d14e98d0cb38037b45c3a343))
* release main ([#1303](https://github.com/zuohuadong/supacloud-1/issues/1303)) ([7cf5889](https://github.com/zuohuadong/supacloud-1/commit/7cf588922e5081926e34ae8b2438634e0ea16c2a))
* release main ([#1320](https://github.com/zuohuadong/supacloud-1/issues/1320)) ([cc7a100](https://github.com/zuohuadong/supacloud-1/commit/cc7a100f892da8e4981161d05e3be46ddbef2aa8))
* release main ([#1328](https://github.com/zuohuadong/supacloud-1/issues/1328)) ([30f5217](https://github.com/zuohuadong/supacloud-1/commit/30f52170a56dd24130b2cf7b5ed79caa9582abaf))
* release main ([#1330](https://github.com/zuohuadong/supacloud-1/issues/1330)) ([95384f8](https://github.com/zuohuadong/supacloud-1/commit/95384f8db80b2706b30953f26944cc681f810543))
* release main ([#1351](https://github.com/zuohuadong/supacloud-1/issues/1351)) ([5e27d1a](https://github.com/zuohuadong/supacloud-1/commit/5e27d1af135d154aa4dc924910bf8204a02942ae))
* release main ([#1361](https://github.com/zuohuadong/supacloud-1/issues/1361)) ([2359236](https://github.com/zuohuadong/supacloud-1/commit/23592368c04a7f876b0e50b00cede6ec5b87e4db))
* release main ([#1405](https://github.com/zuohuadong/supacloud-1/issues/1405)) ([e840527](https://github.com/zuohuadong/supacloud-1/commit/e84052759dbbdec76718af0d2a6f1804f291bdb4))
* release main ([#1431](https://github.com/zuohuadong/supacloud-1/issues/1431)) ([b7255e6](https://github.com/zuohuadong/supacloud-1/commit/b7255e6fbb277e0fdcbbe7cfeacc81cee62f7fe2))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1465](https://github.com/zuohuadong/supacloud-1/issues/1465)) ([392b418](https://github.com/zuohuadong/supacloud-1/commit/392b4189eb437b69d5670037e1cafbecb97d731a))
* release main ([#1472](https://github.com/zuohuadong/supacloud-1/issues/1472)) ([bfe9ea6](https://github.com/zuohuadong/supacloud-1/commit/bfe9ea6cd349c6039068daf414a33f7472e78a7d))
* release main ([#1474](https://github.com/zuohuadong/supacloud-1/issues/1474)) ([6255eb7](https://github.com/zuohuadong/supacloud-1/commit/6255eb7e7eefc4ee5cd06bef05d4c81a29be706a))
* release main ([#1475](https://github.com/zuohuadong/supacloud-1/issues/1475)) ([125e4de](https://github.com/zuohuadong/supacloud-1/commit/125e4de89a17bdd65e7e10b88c84c3f1af274804))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1507](https://github.com/zuohuadong/supacloud-1/issues/1507)) ([b7f3a59](https://github.com/zuohuadong/supacloud-1/commit/b7f3a59885596742a8b11fc808d898165a8989ec))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1586](https://github.com/zuohuadong/supacloud-1/issues/1586)) ([21f22d8](https://github.com/zuohuadong/supacloud-1/commit/21f22d8dba3a1e6e704865727ed5ff4095d28eac))
* release main ([#1592](https://github.com/zuohuadong/supacloud-1/issues/1592)) ([224f76d](https://github.com/zuohuadong/supacloud-1/commit/224f76dfff188cf943152c3ee23cff2269d4d2b9))
* release main ([#1600](https://github.com/zuohuadong/supacloud-1/issues/1600)) ([5209a75](https://github.com/zuohuadong/supacloud-1/commit/5209a7589b785d8243be24ad3ec25a0ccdb7b42c))
* release main ([#1609](https://github.com/zuohuadong/supacloud-1/issues/1609)) ([b52c79c](https://github.com/zuohuadong/supacloud-1/commit/b52c79ceda912786f1299ae2d618172f9252607a))
* release main ([#1610](https://github.com/zuohuadong/supacloud-1/issues/1610)) ([6517b06](https://github.com/zuohuadong/supacloud-1/commit/6517b06bdb9cfb02062288c4bfd1d09fbab1663c))
* release main ([#1617](https://github.com/zuohuadong/supacloud-1/issues/1617)) ([afad389](https://github.com/zuohuadong/supacloud-1/commit/afad38960cf086afeddcdc4565daa7b8cb429c2e))
* release main ([#1633](https://github.com/zuohuadong/supacloud-1/issues/1633)) ([e9db823](https://github.com/zuohuadong/supacloud-1/commit/e9db823b47db6b0d9ebe8057792e35e34c144420))
* release main ([#1638](https://github.com/zuohuadong/supacloud-1/issues/1638)) ([1857d39](https://github.com/zuohuadong/supacloud-1/commit/1857d39b2639e5ddf8f0a671b4167ba9c2f15c39))
* release main ([#1642](https://github.com/zuohuadong/supacloud-1/issues/1642)) ([2c2de43](https://github.com/zuohuadong/supacloud-1/commit/2c2de431073a6097f7589bc8b2f413508aec82b4))
* release main ([#1647](https://github.com/zuohuadong/supacloud-1/issues/1647)) ([9afdb5c](https://github.com/zuohuadong/supacloud-1/commit/9afdb5c348a2e87169e8898b3842091bb8f1ddea))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1661](https://github.com/zuohuadong/supacloud-1/issues/1661)) ([77ea3fa](https://github.com/zuohuadong/supacloud-1/commit/77ea3fa73707222f21561005a6be3569dae606b4))
* release main ([#1668](https://github.com/zuohuadong/supacloud-1/issues/1668)) ([a7ce18b](https://github.com/zuohuadong/supacloud-1/commit/a7ce18b73e0a2e93df664fb8da08cd40f3bdae82))
* release main ([#1671](https://github.com/zuohuadong/supacloud-1/issues/1671)) ([b413a37](https://github.com/zuohuadong/supacloud-1/commit/b413a37ba0b1c8cf7a33649774c1935febd46f92))
* release main ([#1683](https://github.com/zuohuadong/supacloud-1/issues/1683)) ([9393da6](https://github.com/zuohuadong/supacloud-1/commit/9393da66289b8a341f4a3c7fe8553e53986c4bdc))
</details>

<details><summary>elysia: 0.27.0</summary>

## [0.27.0](https://github.com/zuohuadong/supacloud-1/compare/elysia-v0.26.0...elysia-v0.27.0) (2026-10-31)


###   BREAKING CHANGES

* **commands:** HTTP JSON methods return unknown unless decoded through a contract; writes default to no replay. Durable adapters require explicit authorization and input codecs. See docs/command-migration.md for import, auth, schema, and deployment migration steps.

### Features

* add statically compiled AOP boundaries and jobs ([#1160](https://github.com/zuohuadong/supacloud-1/issues/1160)) ([66c962a](https://github.com/zuohuadong/supacloud-1/commit/66c962a923ed6c4dbd3a354715346878793bb14c))
* add SupAuth identity and FA-driven command governance ([#1220](https://github.com/zuohuadong/supacloud-1/issues/1220)) ([66a77ca](https://github.com/zuohuadong/supacloud-1/commit/66a77caea086bb1282772dd9401bd2adb9c04342))
* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* **app:** add portable execution pipeline for Elysia 2 beta ([#1506](https://github.com/zuohuadong/supacloud-1/issues/1506)) ([02486f4](https://github.com/zuohuadong/supacloud-1/commit/02486f43a12d6260cbcabde305857fb92464529a))
* **app:** provide zero-config project defaults ([#1173](https://github.com/zuohuadong/supacloud-1/issues/1173)) ([489824d](https://github.com/zuohuadong/supacloud-1/commit/489824db5137e4675248cfc789d9d86e8139775e))
* **architecture:** enforce compile-time application governance ([#1301](https://github.com/zuohuadong/supacloud-1/issues/1301)) ([b2c1df2](https://github.com/zuohuadong/supacloud-1/commit/b2c1df25294d0195ddf313623b965e599847d9f9))
* **cli:** add governed application starter ([#1193](https://github.com/zuohuadong/supacloud-1/issues/1193)) ([f33561b](https://github.com/zuohuadong/supacloud-1/commit/f33561bfb05e0a63ce08de0153a4fa95f02ac2d6))
* **commands:** unify durable execution with existing workflows ([#1243](https://github.com/zuohuadong/supacloud-1/issues/1243)) ([6da15d4](https://github.com/zuohuadong/supacloud-1/commit/6da15d459e1883ab94e240834200a57e9a41676b))
* **compiler:** diagnose browser-unsafe client schemas ([#1679](https://github.com/zuohuadong/supacloud-1/issues/1679)) ([18582fc](https://github.com/zuohuadong/supacloud-1/commit/18582fcc0384246d87660cb42b6b4acbdc475b5e))
* **compiler:** preserve raw body and wildcard transport contracts ([#1442](https://github.com/zuohuadong/supacloud-1/issues/1442)) ([436146d](https://github.com/zuohuadong/supacloud-1/commit/436146d0f7f74be1c53969a2fc4854b59976d01d))
* complete Angular framework defaults integration ([#1587](https://github.com/zuohuadong/supacloud-1/issues/1587)) ([0dec8ea](https://github.com/zuohuadong/supacloud-1/commit/0dec8ea48f288da27824579038136dd33f8ccb20))
* complete compile-time database architecture ([#1332](https://github.com/zuohuadong/supacloud-1/issues/1332)) ([4a82b4b](https://github.com/zuohuadong/supacloud-1/commit/4a82b4b89078ef371029c6d18b7c674086627a88))
* complete compiler runtime roadmap ([cb4618a](https://github.com/zuohuadong/supacloud-1/commit/cb4618aef455853f7ad408f06d67004d49155ffb))
* **elysia:** add experimental SupaCloud framework profile ([#1513](https://github.com/zuohuadong/supacloud-1/issues/1513)) ([fe0b5a9](https://github.com/zuohuadong/supacloud-1/commit/fe0b5a96a586957d129ce3bc2aade1786452f8bb))
* **elysia:** add opt-in OpenAPI and GraphQL documentation ([#1297](https://github.com/zuohuadong/supacloud-1/issues/1297)) ([d5b3f32](https://github.com/zuohuadong/supacloud-1/commit/d5b3f32a075e813708b462a7b9d45458800b10e5))
* **elysia:** add read-only command preview ([#1302](https://github.com/zuohuadong/supacloud-1/issues/1302)) ([995bcd4](https://github.com/zuohuadong/supacloud-1/commit/995bcd43ac3639465eab476deefadd0f37867427))
* **elysia:** add validated native JSON responses ([#1210](https://github.com/zuohuadong/supacloud-1/issues/1210)) ([28e73fe](https://github.com/zuohuadong/supacloud-1/commit/28e73feff26d77010c23fd439c31b334a7705885))
* **elysia:** Elysia 2 AOT evaluation and end-to-end typing architecture ([#1654](https://github.com/zuohuadong/supacloud-1/issues/1654)) ([39ee49f](https://github.com/zuohuadong/supacloud-1/commit/39ee49f760e85e789c43c1d18cf5729db592f6bc))
* **elysia:** improve Elysia 2.0 type safety and native error handling ([#1669](https://github.com/zuohuadong/supacloud-1/issues/1669)) ([0df61c3](https://github.com/zuohuadong/supacloud-1/commit/0df61c3f82ce61ba9875d9139e0414ae9c68d0e2))
* **elysia:** preserve static DI and add native HTTP policy suite ([#1441](https://github.com/zuohuadong/supacloud-1/issues/1441)) ([6a34a55](https://github.com/zuohuadong/supacloud-1/commit/6a34a551aa42c18ffbeda8f57b791373c67b83d2))
* **framework:** add command composition and recovery observability ([#1432](https://github.com/zuohuadong/supacloud-1/issues/1432)) ([456efcd](https://github.com/zuohuadong/supacloud-1/commit/456efcd807deabeb3f3df6d718c47c427673b1f5))
* **framework:** add OpenAPI generation and typed worker execution ([#1286](https://github.com/zuohuadong/supacloud-1/issues/1286)) ([25dcffb](https://github.com/zuohuadong/supacloud-1/commit/25dcffb9a7a33ee7205868c860126d3d2ef50ff4))
* **framework:** centralize command runtime governance contract ([#1341](https://github.com/zuohuadong/supacloud-1/issues/1341)) ([2d7e795](https://github.com/zuohuadong/supacloud-1/commit/2d7e79595af64c8fbe95a5e754dedcd0a825a282))
* **framework:** complete schema-first route contracts ([#1304](https://github.com/zuohuadong/supacloud-1/issues/1304)) ([4acc3ac](https://github.com/zuohuadong/supacloud-1/commit/4acc3aced2b6e3202705dd87071131af631abad2))
* **framework:** improve vibecoding development workflow ([#1430](https://github.com/zuohuadong/supacloud-1/issues/1430)) ([7bd35ff](https://github.com/zuohuadong/supacloud-1/commit/7bd35ff216fd276f10643f0f13ae217375badc76))
* **framework:** make command governance default ([#1342](https://github.com/zuohuadong/supacloud-1/issues/1342)) ([5ef7362](https://github.com/zuohuadong/supacloud-1/commit/5ef7362ea0bd9f260576b7ecc4c7eef71aa752b4))
* **framework:** runtime acceptance and versioned upgrade gates ([#1318](https://github.com/zuohuadong/supacloud-1/issues/1318)) ([69dfba4](https://github.com/zuohuadong/supacloud-1/commit/69dfba4f44ca3bd9a35b8a5f6fca91d61c9c2f0b))
* integrate application delivery and platform runtime support ([#1453](https://github.com/zuohuadong/supacloud-1/issues/1453)) ([68594fb](https://github.com/zuohuadong/supacloud-1/commit/68594fb67937091bf274a02b33da0d51d31d7b3a))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))
* **platform:** migrate to Elysia rc.0 and harden runtime governance ([cf867e6](https://github.com/zuohuadong/supacloud-1/commit/cf867e63c5e5a3b586ae945467d20da1bef721b7))


### Bug Fixes

* **compiler:** align migration dependency pin with released elysia 0.15.0 ([#1324](https://github.com/zuohuadong/supacloud-1/issues/1324)) ([459ee84](https://github.com/zuohuadong/supacloud-1/commit/459ee840ade78b7f5891a678ef8ccbdd29631a30))
* **compiler:** close job scope review gaps ([#1161](https://github.com/zuohuadong/supacloud-1/issues/1161)) ([2784942](https://github.com/zuohuadong/supacloud-1/commit/278494285d6225d98619e3df76071418539894e6))
* **compiler:** preserve controller prefix params and route titles ([#1439](https://github.com/zuohuadong/supacloud-1/issues/1439)) ([0c62a1f](https://github.com/zuohuadong/supacloud-1/commit/0c62a1fcb784aa4ee43a952323d3126bde7c0e0b))
* **deps,perf:** replace Bun native APIs and resolve audit vulnerabilities ([#1667](https://github.com/zuohuadong/supacloud-1/issues/1667)) ([06a9199](https://github.com/zuohuadong/supacloud-1/commit/06a91990c754ce586f2a2353f253dc50f4fa0f98))
* **elysia:** distinguish response contract failures and scope error mapping ([#1200](https://github.com/zuohuadong/supacloud-1/issues/1200)) ([a6fd97b](https://github.com/zuohuadong/supacloud-1/commit/a6fd97b95ec394098eedffbf0626785fff18ce8c))
* **elysia:** preserve error code normalization ([#1672](https://github.com/zuohuadong/supacloud-1/issues/1672)) ([e7e4ee4](https://github.com/zuohuadong/supacloud-1/commit/e7e4ee47bfafed1c0451e8af4f074c190a967189))
* **elysia:** recognize only Elysia status() responses ([#1307](https://github.com/zuohuadong/supacloud-1/issues/1307)) ([b3fa60c](https://github.com/zuohuadong/supacloud-1/commit/b3fa60c41ec71ef703c939f9d7bd5c38791750e1))
* **elysia:** return 503 when pending work admission is full ([#1594](https://github.com/zuohuadong/supacloud-1/issues/1594)) ([a1e5d2e](https://github.com/zuohuadong/supacloud-1/commit/a1e5d2e9e023a45f852ae7b278509913f0c50e1e))
* pin Elysia 2 beta compatibility boundary ([#1467](https://github.com/zuohuadong/supacloud-1/issues/1467)) ([bdb2a2e](https://github.com/zuohuadong/supacloud-1/commit/bdb2a2e658cae4160f2a774b5c459d1a2d8fb601))


### Performance Improvements

* optimize compiler and upgrade Bun runtime ([#1283](https://github.com/zuohuadong/supacloud-1/issues/1283)) ([381c1b9](https://github.com/zuohuadong/supacloud-1/commit/381c1b98264a563d22fc2f4af85f7f7117563481))


### Documentation

* complete compile-time architecture usage guides ([#1333](https://github.com/zuohuadong/supacloud-1/issues/1333)) ([3190178](https://github.com/zuohuadong/supacloud-1/commit/319017810deb4d7c9911f1bd001ca898f9ea9982))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* **elysia:** regenerate webhook example fixture ([#1673](https://github.com/zuohuadong/supacloud-1/issues/1673)) ([93c8dad](https://github.com/zuohuadong/supacloud-1/commit/93c8dade33d5380a87154e90576faadcbf3bf763))
* release main ([3d041a4](https://github.com/zuohuadong/supacloud-1/commit/3d041a4f2d7d6f29a9160f2c32bea959df72f5d4))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1162](https://github.com/zuohuadong/supacloud-1/issues/1162)) ([df72d07](https://github.com/zuohuadong/supacloud-1/commit/df72d07f6fc025c759145d5fef8d0189e8a801f4))
* release main ([#1176](https://github.com/zuohuadong/supacloud-1/issues/1176)) ([c04a50d](https://github.com/zuohuadong/supacloud-1/commit/c04a50df7df76408208429587970fd1e66ffc789))
* release main ([#1183](https://github.com/zuohuadong/supacloud-1/issues/1183)) ([07ca38e](https://github.com/zuohuadong/supacloud-1/commit/07ca38e6db6c66a2b60f601a6561f65b2a99e65f))
* release main ([#1194](https://github.com/zuohuadong/supacloud-1/issues/1194)) ([7d0eb27](https://github.com/zuohuadong/supacloud-1/commit/7d0eb27ec8b118321e9085aff6cd9f77a2eec642))
* release main ([#1199](https://github.com/zuohuadong/supacloud-1/issues/1199)) ([f374806](https://github.com/zuohuadong/supacloud-1/commit/f3748068f6f0a838b668b81a7b23f9cffd74ca37))
* release main ([#1211](https://github.com/zuohuadong/supacloud-1/issues/1211)) ([5b06eda](https://github.com/zuohuadong/supacloud-1/commit/5b06eda20f637c121f177880291f6ee997cd01a1))
* release main ([#1221](https://github.com/zuohuadong/supacloud-1/issues/1221)) ([254364e](https://github.com/zuohuadong/supacloud-1/commit/254364e9b29bcf873773ef0e54017422e7889a0c))
* release main ([#1244](https://github.com/zuohuadong/supacloud-1/issues/1244)) ([7abc6de](https://github.com/zuohuadong/supacloud-1/commit/7abc6ded6e70fd45cd3da14960a8e4e72933e069))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1284](https://github.com/zuohuadong/supacloud-1/issues/1284)) ([b347a92](https://github.com/zuohuadong/supacloud-1/commit/b347a92b0b4bcfd00b3ee23d22fa17d77225b689))
* release main ([#1287](https://github.com/zuohuadong/supacloud-1/issues/1287)) ([99688d6](https://github.com/zuohuadong/supacloud-1/commit/99688d69245cb881d14e98d0cb38037b45c3a343))
* release main ([#1298](https://github.com/zuohuadong/supacloud-1/issues/1298)) ([2011f2d](https://github.com/zuohuadong/supacloud-1/commit/2011f2dfddc277dee1d9f7b2a87fd8d96b7cfab6))
* release main ([#1303](https://github.com/zuohuadong/supacloud-1/issues/1303)) ([7cf5889](https://github.com/zuohuadong/supacloud-1/commit/7cf588922e5081926e34ae8b2438634e0ea16c2a))
* release main ([#1320](https://github.com/zuohuadong/supacloud-1/issues/1320)) ([cc7a100](https://github.com/zuohuadong/supacloud-1/commit/cc7a100f892da8e4981161d05e3be46ddbef2aa8))
* release main ([#1330](https://github.com/zuohuadong/supacloud-1/issues/1330)) ([95384f8](https://github.com/zuohuadong/supacloud-1/commit/95384f8db80b2706b30953f26944cc681f810543))
* release main ([#1351](https://github.com/zuohuadong/supacloud-1/issues/1351)) ([5e27d1a](https://github.com/zuohuadong/supacloud-1/commit/5e27d1af135d154aa4dc924910bf8204a02942ae))
* release main ([#1431](https://github.com/zuohuadong/supacloud-1/issues/1431)) ([b7255e6](https://github.com/zuohuadong/supacloud-1/commit/b7255e6fbb277e0fdcbbe7cfeacc81cee62f7fe2))
* release main ([#1455](https://github.com/zuohuadong/supacloud-1/issues/1455)) ([e1b923e](https://github.com/zuohuadong/supacloud-1/commit/e1b923e1ed08c08c9439ea01a1774251911b4b73))
* release main ([#1474](https://github.com/zuohuadong/supacloud-1/issues/1474)) ([6255eb7](https://github.com/zuohuadong/supacloud-1/commit/6255eb7e7eefc4ee5cd06bef05d4c81a29be706a))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1507](https://github.com/zuohuadong/supacloud-1/issues/1507)) ([b7f3a59](https://github.com/zuohuadong/supacloud-1/commit/b7f3a59885596742a8b11fc808d898165a8989ec))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
* release main ([#1586](https://github.com/zuohuadong/supacloud-1/issues/1586)) ([21f22d8](https://github.com/zuohuadong/supacloud-1/commit/21f22d8dba3a1e6e704865727ed5ff4095d28eac))
* release main ([#1592](https://github.com/zuohuadong/supacloud-1/issues/1592)) ([224f76d](https://github.com/zuohuadong/supacloud-1/commit/224f76dfff188cf943152c3ee23cff2269d4d2b9))
* release main ([#1657](https://github.com/zuohuadong/supacloud-1/issues/1657)) ([1a3f7ff](https://github.com/zuohuadong/supacloud-1/commit/1a3f7ff901f05dda38ed4827d70a91a4acccd8b3))
* release main ([#1668](https://github.com/zuohuadong/supacloud-1/issues/1668)) ([a7ce18b](https://github.com/zuohuadong/supacloud-1/commit/a7ce18b73e0a2e93df664fb8da08cd40f3bdae82))
* release main ([#1671](https://github.com/zuohuadong/supacloud-1/issues/1671)) ([b413a37](https://github.com/zuohuadong/supacloud-1/commit/b413a37ba0b1c8cf7a33649774c1935febd46f92))
* release main ([#1683](https://github.com/zuohuadong/supacloud-1/issues/1683)) ([9393da6](https://github.com/zuohuadong/supacloud-1/commit/9393da66289b8a341f4a3c7fe8553e53986c4bdc))
</details>

<details><summary>db: 0.14.0</summary>

## [0.14.0](https://github.com/zuohuadong/supacloud-1/compare/db-v0.13.1...db-v0.14.0) (2026-10-31)


###   BREAKING CHANGES

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
</details>

<details><summary>testing: 0.7.0</summary>

## [0.7.0](https://github.com/zuohuadong/supacloud-1/compare/testing-v0.6.0...testing-v0.7.0) (2026-10-31)


###   BREAKING CHANGES

* @supacloud/app no longer publishes dist/index.cjs or a separate synchronous CommonJS entrypoint. CommonJS consumers should use dynamic import() or migrate to ESM. Release-please should handle the corresponding breaking version change.

### Features

* **app:** add governed reactive event streams and lifecycle signals ([38a26e2](https://github.com/zuohuadong/supacloud-1/commit/38a26e2d3b83226a7488df2ef4f1f5714573aeb2))
* default RxJS support with compatible SupaCloud JS calls ([#1556](https://github.com/zuohuadong/supacloud-1/issues/1556)) ([b3015cb](https://github.com/zuohuadong/supacloud-1/commit/b3015cb161c0d87e6611f6c4fc60c120a8c9fffe))
* migrate compiler and strengthen type safety ([81ffb9d](https://github.com/zuohuadong/supacloud-1/commit/81ffb9dae9a09b5561f90e655f1503514d3fe1d7))


### Miscellaneous Chores

* adopt AGPL-3.0-only licensing ([#1481](https://github.com/zuohuadong/supacloud-1/issues/1481)) ([8787ad9](https://github.com/zuohuadong/supacloud-1/commit/8787ad9466ebba8f487d28bf62d5f79a220b0ab8))
* **deps:** upgrade Bun runtime baseline from 1.4.0 to 1.4.2 ([#1271](https://github.com/zuohuadong/supacloud-1/issues/1271)) ([f53aee5](https://github.com/zuohuadong/supacloud-1/commit/f53aee52e93c25e017e9c693a920de5752fe3ddc))
* release main ([#1156](https://github.com/zuohuadong/supacloud-1/issues/1156)) ([3827ba0](https://github.com/zuohuadong/supacloud-1/commit/3827ba09bc1dd1c37e5075773900e2005aed3e0f))
* release main ([#1272](https://github.com/zuohuadong/supacloud-1/issues/1272)) ([8b5c40d](https://github.com/zuohuadong/supacloud-1/commit/8b5c40d442a3c2b7981b084d31da6c60f2d8db1c))
* release main ([#1484](https://github.com/zuohuadong/supacloud-1/issues/1484)) ([41b3e72](https://github.com/zuohuadong/supacloud-1/commit/41b3e72d25dd8b1ea1d3dea5b75c90bdea9be797))
* release main ([#1561](https://github.com/zuohuadong/supacloud-1/issues/1561)) ([3ee71e3](https://github.com/zuohuadong/supacloud-1/commit/3ee71e301e7a5499780b45ec6c64e53698000029))
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).