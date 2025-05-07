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
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

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

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

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

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Famr%2FDocuments%2FGitHub%2FLinked-Creds-Author-Businees-Enhancement%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Famr%2FDocuments%2FGitHub%2FLinked-Creds-Author-Businees-Enhancement&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Famr%2FDocuments%2FGitHub%2FLinked-Creds-Author-Businees-Enhancement%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Famr%2FDocuments%2FGitHub%2FLinked-Creds-Author-Businees-Enhancement&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_amr_Documents_GitHub_Linked_Creds_Author_Businees_Enhancement_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/Users/amr/Documents/GitHub/Linked-Creds-Author-Businees-Enhancement/app/api/auth/[...nextauth]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_amr_Documents_GitHub_Linked_Creds_Author_Businees_Enhancement_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFtciUyRkRvY3VtZW50cyUyRkdpdEh1YiUyRkxpbmtlZC1DcmVkcy1BdXRob3ItQnVzaW5lZXMtRW5oYW5jZW1lbnQlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGYW1yJTJGRG9jdW1lbnRzJTJGR2l0SHViJTJGTGlua2VkLUNyZWRzLUF1dGhvci1CdXNpbmVlcy1FbmhhbmNlbWVudCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDd0Q7QUFDckk7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0anMvP2NjM2EiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2Ftci9Eb2N1bWVudHMvR2l0SHViL0xpbmtlZC1DcmVkcy1BdXRob3ItQnVzaW5lZXMtRW5oYW5jZW1lbnQvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2Ftci9Eb2N1bWVudHMvR2l0SHViL0xpbmtlZC1DcmVkcy1BdXRob3ItQnVzaW5lZXMtRW5oYW5jZW1lbnQvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Famr%2FDocuments%2FGitHub%2FLinked-Creds-Author-Businees-Enhancement%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Famr%2FDocuments%2FGitHub%2FLinked-Creds-Author-Businees-Enhancement&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/google */ \"(rsc)/./node_modules/next-auth/providers/google.js\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()({\n    providers: [\n        (0,next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            clientId: process.env.GOOGLE_CLIENT_ID ?? \"\",\n            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? \"\",\n            authorization: {\n                params: {\n                    scope: \"openid email profile https://www.googleapis.com/auth/drive.file\",\n                    access_type: \"offline\",\n                    prompt: \"consent\"\n                }\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, account, user }) {\n            // Initial sign-in\n            if (account && user) {\n                return {\n                    accessToken: account.access_token,\n                    refreshToken: account.refresh_token,\n                    expires: Date.now() + account.expires_in * 1000,\n                    user: {\n                        name: user.name,\n                        email: user.email,\n                        image: user.image\n                    }\n                };\n            }\n            // Return previous token if the access token has not expired yet\n            if (token.expires && typeof token.expires === \"number\" && Date.now() < token.expires) {\n                return token;\n            }\n            //if the Access token has expired\n            return await refreshAccessToken(token);\n        },\n        async session ({ session, token }) {\n            if (typeof token.accessToken === \"string\") {\n                session.accessToken = token.accessToken;\n            }\n            if (typeof token.refreshToken === \"string\") {\n                session.refreshToken = token.refreshToken;\n            }\n            if (typeof token.expires === \"number\") {\n                session.expires = token.expires;\n            }\n            if (typeof token.error === \"string\") {\n                session.error = token.error;\n            }\n            session.user = token.user;\n            console.log(\"\\uD83D\\uDE80 ~ session ~ session:\", session);\n            return session;\n        }\n    },\n    session: {\n        strategy: \"jwt\",\n        maxAge: 60 * 60 * 24 * 2,\n        updateAge: 60 * 60 * 24 // 1 day\n    }\n});\nasync function refreshAccessToken(token) {\n    try {\n        const url = \"https://oauth2.googleapis.com/token\";\n        const response = await fetch(url, {\n            headers: {\n                \"Content-Type\": \"application/x-www-form-urlencoded\"\n            },\n            method: \"POST\",\n            body: new URLSearchParams({\n                client_id: process.env.GOOGLE_CLIENT_ID ?? \"\",\n                client_secret: process.env.GOOGLE_CLIENT_SECRET ?? \"\",\n                grant_type: \"refresh_token\",\n                refresh_token: token.refreshToken\n            })\n        });\n        const refreshedTokens = await response.json();\n        console.log(\":  refreshAccessToken  refreshedTokens\", refreshedTokens);\n        if (!response.ok) {\n            throw refreshedTokens;\n        }\n        return {\n            ...token,\n            accessToken: refreshedTokens.access_token,\n            expires: Date.now() + refreshedTokens.expires_in * 1000,\n            // If no new refresh token is returned, keep the old one\n            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken\n        };\n    } catch (error) {\n        console.error(\"Error refreshing access token\", error);\n        return {\n            ...token,\n            error: \"RefreshAccessTokenError\"\n        };\n    }\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFnQztBQUN1QjtBQTRCdkQsTUFBTUUsVUFBVUYsZ0RBQVFBLENBQUM7SUFDdkJHLFdBQVc7UUFDVEYsc0VBQWNBLENBQUM7WUFDYkcsVUFBVUMsUUFBUUMsR0FBRyxDQUFDQyxnQkFBZ0IsSUFBSTtZQUMxQ0MsY0FBY0gsUUFBUUMsR0FBRyxDQUFDRyxvQkFBb0IsSUFBSTtZQUNsREMsZUFBZTtnQkFDYkMsUUFBUTtvQkFDTkMsT0FBTztvQkFDUEMsYUFBYTtvQkFDYkMsUUFBUTtnQkFDVjtZQUNGO1FBQ0Y7S0FDRDtJQUNEQyxXQUFXO1FBQ1QsTUFBTUMsS0FBSSxFQUFFQyxLQUFLLEVBQUVDLE9BQU8sRUFBRUMsSUFBSSxFQUFFO1lBQ2hDLGtCQUFrQjtZQUNsQixJQUFJRCxXQUFXQyxNQUFNO2dCQUNuQixPQUFPO29CQUNMQyxhQUFhRixRQUFRRyxZQUFZO29CQUNqQ0MsY0FBY0osUUFBUUssYUFBYTtvQkFDbkNDLFNBQVNDLEtBQUtDLEdBQUcsS0FBSyxRQUFTQyxVQUFVLEdBQWM7b0JBQ3ZEUixNQUFNO3dCQUNKUyxNQUFNVCxLQUFLUyxJQUFJO3dCQUNmQyxPQUFPVixLQUFLVSxLQUFLO3dCQUNqQkMsT0FBT1gsS0FBS1csS0FBSztvQkFDbkI7Z0JBQ0Y7WUFDRjtZQUVBLGdFQUFnRTtZQUVoRSxJQUNFYixNQUFNTyxPQUFPLElBQ2IsT0FBT1AsTUFBTU8sT0FBTyxLQUFLLFlBQ3pCQyxLQUFLQyxHQUFHLEtBQUtULE1BQU1PLE9BQU8sRUFDMUI7Z0JBQ0EsT0FBT1A7WUFDVDtZQUVBLGlDQUFpQztZQUNqQyxPQUFPLE1BQU1jLG1CQUFtQmQ7UUFDbEM7UUFDQSxNQUFNZSxTQUFRLEVBQUVBLE9BQU8sRUFBRWYsS0FBSyxFQUFnQztZQUM1RCxJQUFJLE9BQU9BLE1BQU1HLFdBQVcsS0FBSyxVQUFVO2dCQUN6Q1ksUUFBUVosV0FBVyxHQUFHSCxNQUFNRyxXQUFXO1lBQ3pDO1lBQ0EsSUFBSSxPQUFPSCxNQUFNSyxZQUFZLEtBQUssVUFBVTtnQkFDMUNVLFFBQVFWLFlBQVksR0FBR0wsTUFBTUssWUFBWTtZQUMzQztZQUNBLElBQUksT0FBT0wsTUFBTU8sT0FBTyxLQUFLLFVBQVU7Z0JBQ3JDUSxRQUFRUixPQUFPLEdBQUdQLE1BQU1PLE9BQU87WUFDakM7WUFDQSxJQUFJLE9BQU9QLE1BQU1nQixLQUFLLEtBQUssVUFBVTtnQkFDbkNELFFBQVFDLEtBQUssR0FBR2hCLE1BQU1nQixLQUFLO1lBQzdCO1lBQ0FELFFBQVFiLElBQUksR0FBR0YsTUFBTUUsSUFBSTtZQUV6QmUsUUFBUUMsR0FBRyxDQUFDLHFDQUEyQkg7WUFDdkMsT0FBT0E7UUFDVDtJQUNGO0lBQ0FBLFNBQVM7UUFDUEksVUFBVTtRQUNWQyxRQUFRLEtBQUssS0FBSyxLQUFLO1FBQ3ZCQyxXQUFXLEtBQUssS0FBSyxHQUFHLFFBQVE7SUFDbEM7QUFDRjtBQUVBLGVBQWVQLG1CQUFtQmQsS0FBVTtJQUMxQyxJQUFJO1FBQ0YsTUFBTXNCLE1BQU07UUFFWixNQUFNQyxXQUFXLE1BQU1DLE1BQU1GLEtBQUs7WUFDaENHLFNBQVM7Z0JBQ1AsZ0JBQWdCO1lBQ2xCO1lBQ0FDLFFBQVE7WUFDUkMsTUFBTSxJQUFJQyxnQkFBZ0I7Z0JBQ3hCQyxXQUFXekMsUUFBUUMsR0FBRyxDQUFDQyxnQkFBZ0IsSUFBSTtnQkFDM0N3QyxlQUFlMUMsUUFBUUMsR0FBRyxDQUFDRyxvQkFBb0IsSUFBSTtnQkFDbkR1QyxZQUFZO2dCQUNaekIsZUFBZU4sTUFBTUssWUFBWTtZQUNuQztRQUNGO1FBRUEsTUFBTTJCLGtCQUFrQixNQUFNVCxTQUFTVSxJQUFJO1FBQzNDaEIsUUFBUUMsR0FBRyxDQUFDLDBDQUEwQ2M7UUFFdEQsSUFBSSxDQUFDVCxTQUFTVyxFQUFFLEVBQUU7WUFDaEIsTUFBTUY7UUFDUjtRQUVBLE9BQU87WUFDTCxHQUFHaEMsS0FBSztZQUNSRyxhQUFhNkIsZ0JBQWdCNUIsWUFBWTtZQUN6Q0csU0FBU0MsS0FBS0MsR0FBRyxLQUFLdUIsZ0JBQWdCdEIsVUFBVSxHQUFHO1lBQ25ELHdEQUF3RDtZQUN4REwsY0FBYzJCLGdCQUFnQjFCLGFBQWEsSUFBSU4sTUFBTUssWUFBWTtRQUNuRTtJQUNGLEVBQUUsT0FBT1csT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsaUNBQWlDQTtRQUUvQyxPQUFPO1lBQ0wsR0FBR2hCLEtBQUs7WUFDUmdCLE9BQU87UUFDVDtJQUNGO0FBQ0Y7QUFFMEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0anMvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz9jOGE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnXG5pbXBvcnQgR29vZ2xlUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9nb29nbGUnXG5cbmRlY2xhcmUgbW9kdWxlICduZXh0LWF1dGgnIHtcbiAgaW50ZXJmYWNlIFNlc3Npb24ge1xuICAgIGFjY2Vzc1Rva2VuPzogc3RyaW5nXG4gICAgcmVmcmVzaFRva2VuPzogc3RyaW5nXG4gICAgZXhwaXJlcz86IG51bWJlclxuICAgIGVycm9yPzogc3RyaW5nXG4gICAgdXNlcj86IHtcbiAgICAgIG5hbWU/OiBzdHJpbmdcbiAgICAgIGVtYWlsPzogc3RyaW5nXG4gICAgICBpbWFnZT86IHN0cmluZ1xuICAgIH1cbiAgfVxuXG4gIGludGVyZmFjZSBUb2tlbiB7XG4gICAgYWNjZXNzVG9rZW4/OiBzdHJpbmdcbiAgICByZWZyZXNoVG9rZW4/OiBzdHJpbmdcbiAgICBleHBpcmVzPzogbnVtYmVyXG4gICAgZXJyb3I/OiBzdHJpbmdcbiAgICB1c2VyPzoge1xuICAgICAgbmFtZT86IHN0cmluZ1xuICAgICAgZW1haWw/OiBzdHJpbmdcbiAgICAgIGltYWdlPzogc3RyaW5nXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGhhbmRsZXIgPSBOZXh0QXV0aCh7XG4gIHByb3ZpZGVyczogW1xuICAgIEdvb2dsZVByb3ZpZGVyKHtcbiAgICAgIGNsaWVudElkOiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX0lEID8/ICcnLFxuICAgICAgY2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX1NFQ1JFVCA/PyAnJyxcbiAgICAgIGF1dGhvcml6YXRpb246IHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgc2NvcGU6ICdvcGVuaWQgZW1haWwgcHJvZmlsZSBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2RyaXZlLmZpbGUnLFxuICAgICAgICAgIGFjY2Vzc190eXBlOiAnb2ZmbGluZScsXG4gICAgICAgICAgcHJvbXB0OiAnY29uc2VudCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCBhY2NvdW50LCB1c2VyIH0pIHtcbiAgICAgIC8vIEluaXRpYWwgc2lnbi1pblxuICAgICAgaWYgKGFjY291bnQgJiYgdXNlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGFjY2Vzc1Rva2VuOiBhY2NvdW50LmFjY2Vzc190b2tlbixcbiAgICAgICAgICByZWZyZXNoVG9rZW46IGFjY291bnQucmVmcmVzaF90b2tlbixcbiAgICAgICAgICBleHBpcmVzOiBEYXRlLm5vdygpICsgKGFjY291bnQuZXhwaXJlc19pbiBhcyBudW1iZXIpICogMTAwMCxcbiAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgIGltYWdlOiB1c2VyLmltYWdlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFJldHVybiBwcmV2aW91cyB0b2tlbiBpZiB0aGUgYWNjZXNzIHRva2VuIGhhcyBub3QgZXhwaXJlZCB5ZXRcblxuICAgICAgaWYgKFxuICAgICAgICB0b2tlbi5leHBpcmVzICYmXG4gICAgICAgIHR5cGVvZiB0b2tlbi5leHBpcmVzID09PSAnbnVtYmVyJyAmJlxuICAgICAgICBEYXRlLm5vdygpIDwgdG9rZW4uZXhwaXJlc1xuICAgICAgKSB7XG4gICAgICAgIHJldHVybiB0b2tlblxuICAgICAgfVxuXG4gICAgICAvL2lmIHRoZSBBY2Nlc3MgdG9rZW4gaGFzIGV4cGlyZWRcbiAgICAgIHJldHVybiBhd2FpdCByZWZyZXNoQWNjZXNzVG9rZW4odG9rZW4pXG4gICAgfSxcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfTogeyBzZXNzaW9uOiBhbnk7IHRva2VuOiBhbnkgfSkge1xuICAgICAgaWYgKHR5cGVvZiB0b2tlbi5hY2Nlc3NUb2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc2Vzc2lvbi5hY2Nlc3NUb2tlbiA9IHRva2VuLmFjY2Vzc1Rva2VuXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHRva2VuLnJlZnJlc2hUb2tlbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc2Vzc2lvbi5yZWZyZXNoVG9rZW4gPSB0b2tlbi5yZWZyZXNoVG9rZW5cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdG9rZW4uZXhwaXJlcyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgc2Vzc2lvbi5leHBpcmVzID0gdG9rZW4uZXhwaXJlc1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB0b2tlbi5lcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc2Vzc2lvbi5lcnJvciA9IHRva2VuLmVycm9yXG4gICAgICB9XG4gICAgICBzZXNzaW9uLnVzZXIgPSB0b2tlbi51c2VyXG5cbiAgICAgIGNvbnNvbGUubG9nKCfwn5qAIH4gc2Vzc2lvbiB+IHNlc3Npb246Jywgc2Vzc2lvbilcbiAgICAgIHJldHVybiBzZXNzaW9uXG4gICAgfVxuICB9LFxuICBzZXNzaW9uOiB7XG4gICAgc3RyYXRlZ3k6ICdqd3QnLFxuICAgIG1heEFnZTogNjAgKiA2MCAqIDI0ICogMiwgLy8gMiBkYXlzXG4gICAgdXBkYXRlQWdlOiA2MCAqIDYwICogMjQgLy8gMSBkYXlcbiAgfVxufSlcblxuYXN5bmMgZnVuY3Rpb24gcmVmcmVzaEFjY2Vzc1Rva2VuKHRva2VuOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4nXG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgIH0sXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHk6IG5ldyBVUkxTZWFyY2hQYXJhbXMoe1xuICAgICAgICBjbGllbnRfaWQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfSUQgPz8gJycsXG4gICAgICAgIGNsaWVudF9zZWNyZXQ6IHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfU0VDUkVUID8/ICcnLFxuICAgICAgICBncmFudF90eXBlOiAncmVmcmVzaF90b2tlbicsXG4gICAgICAgIHJlZnJlc2hfdG9rZW46IHRva2VuLnJlZnJlc2hUb2tlblxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgY29uc3QgcmVmcmVzaGVkVG9rZW5zID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgY29uc29sZS5sb2coJzogIHJlZnJlc2hBY2Nlc3NUb2tlbiAgcmVmcmVzaGVkVG9rZW5zJywgcmVmcmVzaGVkVG9rZW5zKVxuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgdGhyb3cgcmVmcmVzaGVkVG9rZW5zXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnRva2VuLFxuICAgICAgYWNjZXNzVG9rZW46IHJlZnJlc2hlZFRva2Vucy5hY2Nlc3NfdG9rZW4sXG4gICAgICBleHBpcmVzOiBEYXRlLm5vdygpICsgcmVmcmVzaGVkVG9rZW5zLmV4cGlyZXNfaW4gKiAxMDAwLFxuICAgICAgLy8gSWYgbm8gbmV3IHJlZnJlc2ggdG9rZW4gaXMgcmV0dXJuZWQsIGtlZXAgdGhlIG9sZCBvbmVcbiAgICAgIHJlZnJlc2hUb2tlbjogcmVmcmVzaGVkVG9rZW5zLnJlZnJlc2hfdG9rZW4gPz8gdG9rZW4ucmVmcmVzaFRva2VuXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHJlZnJlc2hpbmcgYWNjZXNzIHRva2VuJywgZXJyb3IpXG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udG9rZW4sXG4gICAgICBlcnJvcjogJ1JlZnJlc2hBY2Nlc3NUb2tlbkVycm9yJ1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH1cbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIkdvb2dsZVByb3ZpZGVyIiwiaGFuZGxlciIsInByb3ZpZGVycyIsImNsaWVudElkIiwicHJvY2VzcyIsImVudiIsIkdPT0dMRV9DTElFTlRfSUQiLCJjbGllbnRTZWNyZXQiLCJHT09HTEVfQ0xJRU5UX1NFQ1JFVCIsImF1dGhvcml6YXRpb24iLCJwYXJhbXMiLCJzY29wZSIsImFjY2Vzc190eXBlIiwicHJvbXB0IiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJhY2NvdW50IiwidXNlciIsImFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwicmVmcmVzaFRva2VuIiwicmVmcmVzaF90b2tlbiIsImV4cGlyZXMiLCJEYXRlIiwibm93IiwiZXhwaXJlc19pbiIsIm5hbWUiLCJlbWFpbCIsImltYWdlIiwicmVmcmVzaEFjY2Vzc1Rva2VuIiwic2Vzc2lvbiIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInN0cmF0ZWd5IiwibWF4QWdlIiwidXBkYXRlQWdlIiwidXJsIiwicmVzcG9uc2UiLCJmZXRjaCIsImhlYWRlcnMiLCJtZXRob2QiLCJib2R5IiwiVVJMU2VhcmNoUGFyYW1zIiwiY2xpZW50X2lkIiwiY2xpZW50X3NlY3JldCIsImdyYW50X3R5cGUiLCJyZWZyZXNoZWRUb2tlbnMiLCJqc29uIiwib2siLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/yallist","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/preact-render-to-string","vendor-chunks/oidc-token-hash","vendor-chunks/preact","vendor-chunks/object-hash","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Famr%2FDocuments%2FGitHub%2FLinked-Creds-Author-Businees-Enhancement%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Famr%2FDocuments%2FGitHub%2FLinked-Creds-Author-Businees-Enhancement&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();