"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/me/route";
exports.ids = ["app/api/auth/me/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=C%3A%5CUsers%5Chaish%5CHackathon%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Chaish%5CHackathon&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=C%3A%5CUsers%5Chaish%5CHackathon%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Chaish%5CHackathon&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_haish_Hackathon_src_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/me/route.ts */ \"(rsc)/./src/app/api/auth/me/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/me/route\",\n        pathname: \"/api/auth/me\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/me/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\haish\\\\Hackathon\\\\src\\\\app\\\\api\\\\auth\\\\me\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_haish_Hackathon_src_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/me/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbWUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNoYWlzaCU1Q0hhY2thdGhvbiU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDaGFpc2glNUNIYWNrYXRob24maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ2M7QUFDM0Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYWNrYXRob24tcGxhdGZvcm0vPzcxMzkiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcaGFpc2hcXFxcSGFja2F0aG9uXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcbWVcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvbWUvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL21lXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL21lL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcaGFpc2hcXFxcSGFja2F0aG9uXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcbWVcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvbWUvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=C%3A%5CUsers%5Chaish%5CHackathon%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Chaish%5CHackathon&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/me/route.ts":
/*!**************************************!*\
  !*** ./src/app/api/auth/me/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n/* harmony import */ var _lib_api_response__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/api-response */ \"(rsc)/./src/lib/api-response.ts\");\n\n\n\nasync function GET(req) {\n    try {\n        const session = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_0__.getSessionFromRequest)(req);\n        if (!session) {\n            return (0,_lib_api_response__WEBPACK_IMPORTED_MODULE_2__.apiSuccess)({\n                user: null\n            });\n        }\n        const user = await _lib_db__WEBPACK_IMPORTED_MODULE_1__[\"default\"].user.findUnique({\n            where: {\n                id: session.userId\n            },\n            select: {\n                id: true,\n                name: true,\n                username: true,\n                email: true,\n                avatar: true,\n                bio: true,\n                location: true,\n                website: true,\n                github: true,\n                linkedin: true,\n                skills: true,\n                role: true,\n                createdAt: true,\n                organizations: {\n                    select: {\n                        id: true,\n                        name: true,\n                        slug: true,\n                        logo: true\n                    }\n                }\n            }\n        });\n        if (!user) {\n            return (0,_lib_api_response__WEBPACK_IMPORTED_MODULE_2__.apiSuccess)({\n                user: null\n            });\n        }\n        return (0,_lib_api_response__WEBPACK_IMPORTED_MODULE_2__.apiSuccess)({\n            user: {\n                ...user,\n                skills: user.skills ? JSON.parse(user.skills) : []\n            }\n        });\n    } catch (error) {\n        return (0,_lib_api_response__WEBPACK_IMPORTED_MODULE_2__.apiError)(error.message || \"Failed to fetch user session\", \"INTERNAL_ERROR\", 500);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL21lL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDbUQ7QUFDckI7QUFDNEI7QUFFbkQsZUFBZUksSUFBSUMsR0FBZ0I7SUFDeEMsSUFBSTtRQUNGLE1BQU1DLFVBQVVOLGdFQUFxQkEsQ0FBQ0s7UUFDdEMsSUFBSSxDQUFDQyxTQUFTO1lBQ1osT0FBT0gsNkRBQVVBLENBQUM7Z0JBQUVJLE1BQU07WUFBSztRQUNqQztRQUVBLE1BQU1BLE9BQU8sTUFBTU4sK0NBQU1BLENBQUNNLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1lBQ3hDQyxPQUFPO2dCQUFFQyxJQUFJSixRQUFRSyxNQUFNO1lBQUM7WUFDNUJDLFFBQVE7Z0JBQ05GLElBQUk7Z0JBQ0pHLE1BQU07Z0JBQ05DLFVBQVU7Z0JBQ1ZDLE9BQU87Z0JBQ1BDLFFBQVE7Z0JBQ1JDLEtBQUs7Z0JBQ0xDLFVBQVU7Z0JBQ1ZDLFNBQVM7Z0JBQ1RDLFFBQVE7Z0JBQ1JDLFVBQVU7Z0JBQ1ZDLFFBQVE7Z0JBQ1JDLE1BQU07Z0JBQ05DLFdBQVc7Z0JBQ1hDLGVBQWU7b0JBQ2JiLFFBQVE7d0JBQUVGLElBQUk7d0JBQU1HLE1BQU07d0JBQU1hLE1BQU07d0JBQU1DLE1BQU07b0JBQUs7Z0JBQ3pEO1lBQ0Y7UUFDRjtRQUVBLElBQUksQ0FBQ3BCLE1BQU07WUFDVCxPQUFPSiw2REFBVUEsQ0FBQztnQkFBRUksTUFBTTtZQUFLO1FBQ2pDO1FBRUEsT0FBT0osNkRBQVVBLENBQUM7WUFDaEJJLE1BQU07Z0JBQ0osR0FBR0EsSUFBSTtnQkFDUGUsUUFBUWYsS0FBS2UsTUFBTSxHQUFHTSxLQUFLQyxLQUFLLENBQUN0QixLQUFLZSxNQUFNLElBQUksRUFBRTtZQUNwRDtRQUNGO0lBQ0YsRUFBRSxPQUFPUSxPQUFZO1FBQ25CLE9BQU81QiwyREFBUUEsQ0FBQzRCLE1BQU1DLE9BQU8sSUFBSSxnQ0FBZ0Msa0JBQWtCO0lBQ3JGO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYWNrYXRob24tcGxhdGZvcm0vLi9zcmMvYXBwL2FwaS9hdXRoL21lL3JvdXRlLnRzPzU4YmYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IGdldFNlc3Npb25Gcm9tUmVxdWVzdCB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG5pbXBvcnQgcHJpc21hIGZyb20gXCJAL2xpYi9kYlwiO1xuaW1wb3J0IHsgYXBpRXJyb3IsIGFwaVN1Y2Nlc3MgfSBmcm9tIFwiQC9saWIvYXBpLXJlc3BvbnNlXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxOiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBnZXRTZXNzaW9uRnJvbVJlcXVlc3QocmVxKTtcbiAgICBpZiAoIXNlc3Npb24pIHtcbiAgICAgIHJldHVybiBhcGlTdWNjZXNzKHsgdXNlcjogbnVsbCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBpZDogc2Vzc2lvbi51c2VySWQgfSxcbiAgICAgIHNlbGVjdDoge1xuICAgICAgICBpZDogdHJ1ZSxcbiAgICAgICAgbmFtZTogdHJ1ZSxcbiAgICAgICAgdXNlcm5hbWU6IHRydWUsXG4gICAgICAgIGVtYWlsOiB0cnVlLFxuICAgICAgICBhdmF0YXI6IHRydWUsXG4gICAgICAgIGJpbzogdHJ1ZSxcbiAgICAgICAgbG9jYXRpb246IHRydWUsXG4gICAgICAgIHdlYnNpdGU6IHRydWUsXG4gICAgICAgIGdpdGh1YjogdHJ1ZSxcbiAgICAgICAgbGlua2VkaW46IHRydWUsXG4gICAgICAgIHNraWxsczogdHJ1ZSxcbiAgICAgICAgcm9sZTogdHJ1ZSxcbiAgICAgICAgY3JlYXRlZEF0OiB0cnVlLFxuICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgc2VsZWN0OiB7IGlkOiB0cnVlLCBuYW1lOiB0cnVlLCBzbHVnOiB0cnVlLCBsb2dvOiB0cnVlIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4gYXBpU3VjY2Vzcyh7IHVzZXI6IG51bGwgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFwaVN1Y2Nlc3Moe1xuICAgICAgdXNlcjoge1xuICAgICAgICAuLi51c2VyLFxuICAgICAgICBza2lsbHM6IHVzZXIuc2tpbGxzID8gSlNPTi5wYXJzZSh1c2VyLnNraWxscykgOiBbXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICByZXR1cm4gYXBpRXJyb3IoZXJyb3IubWVzc2FnZSB8fCBcIkZhaWxlZCB0byBmZXRjaCB1c2VyIHNlc3Npb25cIiwgXCJJTlRFUk5BTF9FUlJPUlwiLCA1MDApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiZ2V0U2Vzc2lvbkZyb21SZXF1ZXN0IiwicHJpc21hIiwiYXBpRXJyb3IiLCJhcGlTdWNjZXNzIiwiR0VUIiwicmVxIiwic2Vzc2lvbiIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpZCIsInVzZXJJZCIsInNlbGVjdCIsIm5hbWUiLCJ1c2VybmFtZSIsImVtYWlsIiwiYXZhdGFyIiwiYmlvIiwibG9jYXRpb24iLCJ3ZWJzaXRlIiwiZ2l0aHViIiwibGlua2VkaW4iLCJza2lsbHMiLCJyb2xlIiwiY3JlYXRlZEF0Iiwib3JnYW5pemF0aW9ucyIsInNsdWciLCJsb2dvIiwiSlNPTiIsInBhcnNlIiwiZXJyb3IiLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/me/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/api-response.ts":
/*!*********************************!*\
  !*** ./src/lib/api-response.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   apiError: () => (/* binding */ apiError),\n/* harmony export */   apiSuccess: () => (/* binding */ apiSuccess)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nfunction apiSuccess(data, message, status = 200) {\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true,\n        data,\n        message\n    }, {\n        status\n    });\n}\nfunction apiError(message, code = \"BAD_REQUEST\", status = 400, fields) {\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: false,\n        error: {\n            code,\n            message,\n            fields: fields || {}\n        }\n    }, {\n        status\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2FwaS1yZXNwb25zZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMkM7QUFPcEMsU0FBU0MsV0FBY0MsSUFBTyxFQUFFQyxPQUFnQixFQUFFQyxTQUFTLEdBQUc7SUFDbkUsT0FBT0oscURBQVlBLENBQUNLLElBQUksQ0FDdEI7UUFDRUMsU0FBUztRQUNUSjtRQUNBQztJQUNGLEdBQ0E7UUFBRUM7SUFBTztBQUViO0FBRU8sU0FBU0csU0FDZEosT0FBZSxFQUNmSyxPQUFPLGFBQWEsRUFDcEJKLFNBQVMsR0FBRyxFQUNaSyxNQUErQjtJQUUvQixPQUFPVCxxREFBWUEsQ0FBQ0ssSUFBSSxDQUN0QjtRQUNFQyxTQUFTO1FBQ1RJLE9BQU87WUFDTEY7WUFDQUw7WUFDQU0sUUFBUUEsVUFBVSxDQUFDO1FBQ3JCO0lBQ0YsR0FDQTtRQUFFTDtJQUFPO0FBRWIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYWNrYXRob24tcGxhdGZvcm0vLi9zcmMvbGliL2FwaS1yZXNwb25zZS50cz9hNTBkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFwaVJlc3BvbnNlT3B0aW9ucyB7XG4gIHN0YXR1cz86IG51bWJlcjtcbiAgaGVhZGVycz86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcGlTdWNjZXNzPFQ+KGRhdGE6IFQsIG1lc3NhZ2U/OiBzdHJpbmcsIHN0YXR1cyA9IDIwMCkge1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIGRhdGEsXG4gICAgICBtZXNzYWdlLFxuICAgIH0sXG4gICAgeyBzdGF0dXMgfVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBpRXJyb3IoXG4gIG1lc3NhZ2U6IHN0cmluZyxcbiAgY29kZSA9IFwiQkFEX1JFUVVFU1RcIixcbiAgc3RhdHVzID0gNDAwLFxuICBmaWVsZHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XG4pIHtcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgIHtcbiAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgZXJyb3I6IHtcbiAgICAgICAgY29kZSxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgZmllbGRzOiBmaWVsZHMgfHwge30sXG4gICAgICB9LFxuICAgIH0sXG4gICAgeyBzdGF0dXMgfVxuICApO1xufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImFwaVN1Y2Nlc3MiLCJkYXRhIiwibWVzc2FnZSIsInN0YXR1cyIsImpzb24iLCJzdWNjZXNzIiwiYXBpRXJyb3IiLCJjb2RlIiwiZmllbGRzIiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/api-response.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AUTH_COOKIE_NAME: () => (/* binding */ AUTH_COOKIE_NAME),\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   getSessionFromRequest: () => (/* binding */ getSessionFromRequest),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   signToken: () => (/* binding */ signToken),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\n\nconst JWT_SECRET = process.env.JWT_SECRET || \"super-secret-hackathon-jwt-key-2026\";\nconst AUTH_COOKIE_NAME = \"hackathon_session\";\nasync function hashPassword(password) {\n    const salt = await bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().genSalt(10);\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().hash(password, salt);\n}\nasync function verifyPassword(password, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1___default().compare(password, hash);\n}\nfunction signToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().sign(payload, JWT_SECRET, {\n        expiresIn: \"7d\"\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(token, JWT_SECRET);\n    } catch  {\n        return null;\n    }\n}\nasync function getSession() {\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)();\n    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;\n    if (!token) return null;\n    return verifyToken(token);\n}\nfunction getSessionFromRequest(req) {\n    // Check cookie first\n    const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;\n    if (cookieToken) {\n        const payload = verifyToken(cookieToken);\n        if (payload) return payload;\n    }\n    // Check Authorization header (Bearer token)\n    const authHeader = req.headers.get(\"authorization\");\n    if (authHeader && authHeader.startsWith(\"Bearer \")) {\n        const headerToken = authHeader.substring(7);\n        return verifyToken(headerToken);\n    }\n    return null;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQStCO0FBQ0Q7QUFDUztBQUd2QyxNQUFNRyxhQUFhQyxRQUFRQyxHQUFHLENBQUNGLFVBQVUsSUFBSTtBQUN0QyxNQUFNRyxtQkFBbUIsb0JBQW9CO0FBVzdDLGVBQWVDLGFBQWFDLFFBQWdCO0lBQ2pELE1BQU1DLE9BQU8sTUFBTVIsdURBQWMsQ0FBQztJQUNsQyxPQUFPQSxvREFBVyxDQUFDTyxVQUFVQztBQUMvQjtBQUVPLGVBQWVHLGVBQWVKLFFBQWdCLEVBQUVHLElBQVk7SUFDakUsT0FBT1YsdURBQWMsQ0FBQ08sVUFBVUc7QUFDbEM7QUFFTyxTQUFTRyxVQUFVQyxPQUFtQjtJQUMzQyxPQUFPZix3REFBUSxDQUFDZSxTQUFTWixZQUFZO1FBQUVjLFdBQVc7SUFBSztBQUN6RDtBQUVPLFNBQVNDLFlBQVlDLEtBQWE7SUFDdkMsSUFBSTtRQUNGLE9BQU9uQiwwREFBVSxDQUFDbUIsT0FBT2hCO0lBQzNCLEVBQUUsT0FBTTtRQUNOLE9BQU87SUFDVDtBQUNGO0FBRU8sZUFBZWtCO0lBQ3BCLE1BQU1DLGNBQWNwQixxREFBT0E7SUFDM0IsTUFBTWlCLFFBQVFHLFlBQVlDLEdBQUcsQ0FBQ2pCLG1CQUFtQmtCO0lBQ2pELElBQUksQ0FBQ0wsT0FBTyxPQUFPO0lBQ25CLE9BQU9ELFlBQVlDO0FBQ3JCO0FBRU8sU0FBU00sc0JBQXNCQyxHQUFnQjtJQUNwRCxxQkFBcUI7SUFDckIsTUFBTUMsY0FBY0QsSUFBSXhCLE9BQU8sQ0FBQ3FCLEdBQUcsQ0FBQ2pCLG1CQUFtQmtCO0lBQ3ZELElBQUlHLGFBQWE7UUFDZixNQUFNWixVQUFVRyxZQUFZUztRQUM1QixJQUFJWixTQUFTLE9BQU9BO0lBQ3RCO0lBRUEsNENBQTRDO0lBQzVDLE1BQU1hLGFBQWFGLElBQUlHLE9BQU8sQ0FBQ04sR0FBRyxDQUFDO0lBQ25DLElBQUlLLGNBQWNBLFdBQVdFLFVBQVUsQ0FBQyxZQUFZO1FBQ2xELE1BQU1DLGNBQWNILFdBQVdJLFNBQVMsQ0FBQztRQUN6QyxPQUFPZCxZQUFZYTtJQUNyQjtJQUVBLE9BQU87QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL2hhY2thdGhvbi1wbGF0Zm9ybS8uL3NyYy9saWIvYXV0aC50cz82NjkyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiO1xuaW1wb3J0IGJjcnlwdCBmcm9tIFwiYmNyeXB0anNcIjtcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgeyBOZXh0UmVxdWVzdCB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuXG5jb25zdCBKV1RfU0VDUkVUID0gcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCB8fCBcInN1cGVyLXNlY3JldC1oYWNrYXRob24tand0LWtleS0yMDI2XCI7XG5leHBvcnQgY29uc3QgQVVUSF9DT09LSUVfTkFNRSA9IFwiaGFja2F0aG9uX3Nlc3Npb25cIjtcblxuZXhwb3J0IGludGVyZmFjZSBKd3RQYXlsb2FkIHtcbiAgdXNlcklkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIHVzZXJuYW1lOiBzdHJpbmc7XG4gIHJvbGU6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBhdmF0YXI/OiBzdHJpbmcgfCBudWxsO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBzYWx0ID0gYXdhaXQgYmNyeXB0LmdlblNhbHQoMTApO1xuICByZXR1cm4gYmNyeXB0Lmhhc2gocGFzc3dvcmQsIHNhbHQpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZywgaGFzaDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgaGFzaCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduVG9rZW4ocGF5bG9hZDogSnd0UGF5bG9hZCk6IHN0cmluZyB7XG4gIHJldHVybiBqd3Quc2lnbihwYXlsb2FkLCBKV1RfU0VDUkVULCB7IGV4cGlyZXNJbjogXCI3ZFwiIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5VG9rZW4odG9rZW46IHN0cmluZyk6IEp3dFBheWxvYWQgfCBudWxsIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCkgYXMgSnd0UGF5bG9hZDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlc3Npb24oKTogUHJvbWlzZTxKd3RQYXlsb2FkIHwgbnVsbD4ge1xuICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKTtcbiAgY29uc3QgdG9rZW4gPSBjb29raWVTdG9yZS5nZXQoQVVUSF9DT09LSUVfTkFNRSk/LnZhbHVlO1xuICBpZiAoIXRva2VuKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHZlcmlmeVRva2VuKHRva2VuKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlc3Npb25Gcm9tUmVxdWVzdChyZXE6IE5leHRSZXF1ZXN0KTogSnd0UGF5bG9hZCB8IG51bGwge1xuICAvLyBDaGVjayBjb29raWUgZmlyc3RcbiAgY29uc3QgY29va2llVG9rZW4gPSByZXEuY29va2llcy5nZXQoQVVUSF9DT09LSUVfTkFNRSk/LnZhbHVlO1xuICBpZiAoY29va2llVG9rZW4pIHtcbiAgICBjb25zdCBwYXlsb2FkID0gdmVyaWZ5VG9rZW4oY29va2llVG9rZW4pO1xuICAgIGlmIChwYXlsb2FkKSByZXR1cm4gcGF5bG9hZDtcbiAgfVxuXG4gIC8vIENoZWNrIEF1dGhvcml6YXRpb24gaGVhZGVyIChCZWFyZXIgdG9rZW4pXG4gIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5nZXQoXCJhdXRob3JpemF0aW9uXCIpO1xuICBpZiAoYXV0aEhlYWRlciAmJiBhdXRoSGVhZGVyLnN0YXJ0c1dpdGgoXCJCZWFyZXIgXCIpKSB7XG4gICAgY29uc3QgaGVhZGVyVG9rZW4gPSBhdXRoSGVhZGVyLnN1YnN0cmluZyg3KTtcbiAgICByZXR1cm4gdmVyaWZ5VG9rZW4oaGVhZGVyVG9rZW4pO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG4iXSwibmFtZXMiOlsiand0IiwiYmNyeXB0IiwiY29va2llcyIsIkpXVF9TRUNSRVQiLCJwcm9jZXNzIiwiZW52IiwiQVVUSF9DT09LSUVfTkFNRSIsImhhc2hQYXNzd29yZCIsInBhc3N3b3JkIiwic2FsdCIsImdlblNhbHQiLCJoYXNoIiwidmVyaWZ5UGFzc3dvcmQiLCJjb21wYXJlIiwic2lnblRva2VuIiwicGF5bG9hZCIsInNpZ24iLCJleHBpcmVzSW4iLCJ2ZXJpZnlUb2tlbiIsInRva2VuIiwidmVyaWZ5IiwiZ2V0U2Vzc2lvbiIsImNvb2tpZVN0b3JlIiwiZ2V0IiwidmFsdWUiLCJnZXRTZXNzaW9uRnJvbVJlcXVlc3QiLCJyZXEiLCJjb29raWVUb2tlbiIsImF1dGhIZWFkZXIiLCJoZWFkZXJzIiwic3RhcnRzV2l0aCIsImhlYWRlclRva2VuIiwic3Vic3RyaW5nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBOEM7QUFFOUMsTUFBTUMsa0JBQWtCQztBQUlqQixNQUFNQyxTQUNYRixnQkFBZ0JFLE1BQU0sSUFDdEIsSUFBSUgsd0RBQVlBLENBQUM7SUFDZkksS0FBS0MsS0FBc0MsR0FBRztRQUFDO1FBQVM7S0FBTyxHQUFHLENBQVM7QUFDN0UsR0FBRztBQUVMLElBQUlBLElBQXFDLEVBQUVKLGdCQUFnQkUsTUFBTSxHQUFHQTtBQUVwRSxpRUFBZUEsTUFBTUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2hhY2thdGhvbi1wbGF0Zm9ybS8uL3NyYy9saWIvZGIudHM/OWU0ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIjtcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIHtcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgcHJpc21hID1cbiAgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA/P1xuICBuZXcgUHJpc21hQ2xpZW50KHtcbiAgICBsb2c6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIgPyBbXCJlcnJvclwiLCBcIndhcm5cIl0gOiBbXCJlcnJvclwiXSxcbiAgfSk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJpc21hIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/jws","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/bcryptjs","vendor-chunks/safe-buffer","vendor-chunks/ms","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=C%3A%5CUsers%5Chaish%5CHackathon%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Chaish%5CHackathon&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();