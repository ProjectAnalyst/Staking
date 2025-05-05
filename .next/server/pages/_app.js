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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wagmi/providers/public */ \"wagmi/providers/public\");\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"@rainbow-me/rainbowkit\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @rainbow-me/rainbowkit/styles.css */ \"./node_modules/@rainbow-me/rainbowkit/dist/index.css\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_5__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wagmi__WEBPACK_IMPORTED_MODULE_1__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_2__, _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__]);\n([wagmi__WEBPACK_IMPORTED_MODULE_1__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_2__, _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nconst baseSepolia = {\n    id: 84532,\n    name: \"Base Sepolia\",\n    network: \"base-sepolia\",\n    nativeCurrency: {\n        name: \"Base Sepolia ETH\",\n        symbol: \"ETH\",\n        decimals: 18\n    },\n    rpcUrls: {\n        default: {\n            http: [\n                \"https://sepolia.base.org\"\n            ]\n        },\n        public: {\n            http: [\n                \"https://sepolia.base.org\"\n            ]\n        }\n    },\n    blockExplorers: {\n        default: {\n            name: \"BaseScan\",\n            url: \"https://sepolia.basescan.org\"\n        }\n    },\n    testnet: true,\n    // Disable ENS resolution on Base Sepolia\n    ens: {\n        address: \"0x0000000000000000000000000000000000000000\"\n    }\n};\nconst { chains, publicClient, webSocketPublicClient } = (0,wagmi__WEBPACK_IMPORTED_MODULE_1__.configureChains)([\n    baseSepolia\n], [\n    (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_2__.publicProvider)()\n]);\nconst { connectors } = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.getDefaultWallets)({\n    appName: \"MINI Staking\",\n    projectId: \"4c093bc07e987103a76d99a963d8103c\" || 0,\n    chains\n});\nconst config = (0,wagmi__WEBPACK_IMPORTED_MODULE_1__.createConfig)({\n    autoConnect: true,\n    connectors,\n    publicClient,\n    webSocketPublicClient\n});\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_1__.WagmiConfig, {\n        config: config,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.RainbowKitProvider, {\n            chains: chains,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/home/mike/Documents/Code/StakingVRUFF/src/pages/_app.tsx\",\n                lineNumber: 50,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/mike/Documents/Code/StakingVRUFF/src/pages/_app.tsx\",\n            lineNumber: 49,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/mike/Documents/Code/StakingVRUFF/src/pages/_app.tsx\",\n        lineNumber: 48,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBbUU7QUFDWDtBQUN1QjtBQUNwQztBQUdaO0FBRS9CLE1BQU1NLGNBQWM7SUFDbEJDLElBQUk7SUFDSkMsTUFBTTtJQUNOQyxTQUFTO0lBQ1RDLGdCQUFnQjtRQUFFRixNQUFNO1FBQW9CRyxRQUFRO1FBQU9DLFVBQVU7SUFBRztJQUN4RUMsU0FBUztRQUNQQyxTQUFTO1lBQUVDLE1BQU07Z0JBQUM7YUFBMkI7UUFBQztRQUM5Q0MsUUFBUTtZQUFFRCxNQUFNO2dCQUFDO2FBQTJCO1FBQUM7SUFDL0M7SUFDQUUsZ0JBQWdCO1FBQ2RILFNBQVM7WUFBRU4sTUFBTTtZQUFZVSxLQUFLO1FBQStCO0lBQ25FO0lBQ0FDLFNBQVM7SUFDVCx5Q0FBeUM7SUFDekNDLEtBQUs7UUFDSEMsU0FBUztJQUNYO0FBQ0Y7QUFFQSxNQUFNLEVBQUVDLE1BQU0sRUFBRUMsWUFBWSxFQUFFQyxxQkFBcUIsRUFBRSxHQUFHdEIsc0RBQWVBLENBQ3JFO0lBQUNJO0NBQVksRUFDYjtJQUFDSCxzRUFBY0E7Q0FBRztBQUdwQixNQUFNLEVBQUVzQixVQUFVLEVBQUUsR0FBR3BCLHlFQUFpQkEsQ0FBQztJQUN2Q3FCLFNBQVM7SUFDVEMsV0FBV0Msa0NBQWdELElBQUk7SUFDL0ROO0FBQ0Y7QUFFQSxNQUFNUyxTQUFTOUIsbURBQVlBLENBQUM7SUFDMUIrQixhQUFhO0lBQ2JQO0lBQ0FGO0lBQ0FDO0FBQ0Y7QUFFZSxTQUFTUyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELHFCQUNFLDhEQUFDbkMsOENBQVdBO1FBQUMrQixRQUFRQTtrQkFDbkIsNEVBQUMzQixzRUFBa0JBO1lBQUNrQixRQUFRQTtzQkFDMUIsNEVBQUNZO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aXJ0dS1zdGFraW5nLWRhcHAvLi9zcmMvcGFnZXMvX2FwcC50c3g/ZjlkNiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBXYWdtaUNvbmZpZywgY3JlYXRlQ29uZmlnLCBjb25maWd1cmVDaGFpbnMgfSBmcm9tICd3YWdtaSc7XG5pbXBvcnQgeyBwdWJsaWNQcm92aWRlciB9IGZyb20gJ3dhZ21pL3Byb3ZpZGVycy9wdWJsaWMnO1xuaW1wb3J0IHsgUmFpbmJvd0tpdFByb3ZpZGVyLCBnZXREZWZhdWx0V2FsbGV0cyB9IGZyb20gJ0ByYWluYm93LW1lL3JhaW5ib3draXQnO1xuaW1wb3J0ICdAcmFpbmJvdy1tZS9yYWluYm93a2l0L3N0eWxlcy5jc3MnO1xuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcbmltcG9ydCB7IGh0dHAgfSBmcm9tICd2aWVtJztcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJztcblxuY29uc3QgYmFzZVNlcG9saWEgPSB7XG4gIGlkOiA4NDUzMixcbiAgbmFtZTogJ0Jhc2UgU2Vwb2xpYScsXG4gIG5ldHdvcms6ICdiYXNlLXNlcG9saWEnLFxuICBuYXRpdmVDdXJyZW5jeTogeyBuYW1lOiAnQmFzZSBTZXBvbGlhIEVUSCcsIHN5bWJvbDogJ0VUSCcsIGRlY2ltYWxzOiAxOCB9LFxuICBycGNVcmxzOiB7XG4gICAgZGVmYXVsdDogeyBodHRwOiBbJ2h0dHBzOi8vc2Vwb2xpYS5iYXNlLm9yZyddIH0sXG4gICAgcHVibGljOiB7IGh0dHA6IFsnaHR0cHM6Ly9zZXBvbGlhLmJhc2Uub3JnJ10gfSxcbiAgfSxcbiAgYmxvY2tFeHBsb3JlcnM6IHtcbiAgICBkZWZhdWx0OiB7IG5hbWU6ICdCYXNlU2NhbicsIHVybDogJ2h0dHBzOi8vc2Vwb2xpYS5iYXNlc2Nhbi5vcmcnIH0sXG4gIH0sXG4gIHRlc3RuZXQ6IHRydWUsXG4gIC8vIERpc2FibGUgRU5TIHJlc29sdXRpb24gb24gQmFzZSBTZXBvbGlhXG4gIGVuczoge1xuICAgIGFkZHJlc3M6ICcweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnLFxuICB9LFxufTtcblxuY29uc3QgeyBjaGFpbnMsIHB1YmxpY0NsaWVudCwgd2ViU29ja2V0UHVibGljQ2xpZW50IH0gPSBjb25maWd1cmVDaGFpbnMoXG4gIFtiYXNlU2Vwb2xpYV0sXG4gIFtwdWJsaWNQcm92aWRlcigpXVxuKTtcblxuY29uc3QgeyBjb25uZWN0b3JzIH0gPSBnZXREZWZhdWx0V2FsbGV0cyh7XG4gIGFwcE5hbWU6ICdNSU5JIFN0YWtpbmcnLFxuICBwcm9qZWN0SWQ6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1dBTExFVENPTk5FQ1RfUFJPSkVDVF9JRCB8fCAnJyxcbiAgY2hhaW5zLFxufSk7XG5cbmNvbnN0IGNvbmZpZyA9IGNyZWF0ZUNvbmZpZyh7XG4gIGF1dG9Db25uZWN0OiB0cnVlLFxuICBjb25uZWN0b3JzLFxuICBwdWJsaWNDbGllbnQsXG4gIHdlYlNvY2tldFB1YmxpY0NsaWVudCxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxXYWdtaUNvbmZpZyBjb25maWc9e2NvbmZpZ30+XG4gICAgICA8UmFpbmJvd0tpdFByb3ZpZGVyIGNoYWlucz17Y2hhaW5zfT5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9SYWluYm93S2l0UHJvdmlkZXI+XG4gICAgPC9XYWdtaUNvbmZpZz5cbiAgKTtcbn0gIl0sIm5hbWVzIjpbIldhZ21pQ29uZmlnIiwiY3JlYXRlQ29uZmlnIiwiY29uZmlndXJlQ2hhaW5zIiwicHVibGljUHJvdmlkZXIiLCJSYWluYm93S2l0UHJvdmlkZXIiLCJnZXREZWZhdWx0V2FsbGV0cyIsImJhc2VTZXBvbGlhIiwiaWQiLCJuYW1lIiwibmV0d29yayIsIm5hdGl2ZUN1cnJlbmN5Iiwic3ltYm9sIiwiZGVjaW1hbHMiLCJycGNVcmxzIiwiZGVmYXVsdCIsImh0dHAiLCJwdWJsaWMiLCJibG9ja0V4cGxvcmVycyIsInVybCIsInRlc3RuZXQiLCJlbnMiLCJhZGRyZXNzIiwiY2hhaW5zIiwicHVibGljQ2xpZW50Iiwid2ViU29ja2V0UHVibGljQ2xpZW50IiwiY29ubmVjdG9ycyIsImFwcE5hbWUiLCJwcm9qZWN0SWQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfV0FMTEVUQ09OTkVDVF9QUk9KRUNUX0lEIiwiY29uZmlnIiwiYXV0b0Nvbm5lY3QiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@rainbow-me/rainbowkit":
/*!*****************************************!*\
  !*** external "@rainbow-me/rainbowkit" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@rainbow-me/rainbowkit");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/providers/public":
/*!*****************************************!*\
  !*** external "wagmi/providers/public" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/providers/public");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@rainbow-me"], () => (__webpack_exec__("./src/pages/_app.tsx")));
module.exports = __webpack_exports__;

})();