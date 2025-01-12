"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const ssrHome = require("./ssr-home.cjs");
require("axios");
const Main = ssrHome.create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { dataForHydration } = $$props;
  console.log("++++++++++++++++", dataForHydration);
  if ($$props.dataForHydration === void 0 && $$bindings.dataForHydration && dataForHydration !== void 0) $$bindings.dataForHydration(dataForHydration);
  return `<main><h1>${ssrHome.escape(dataForHydration.message)}</h1> <div id="app">${ssrHome.validate_component(ssrHome.Home, "Home").$$render($$result, { dataForHydration }, {}, {})}</div></main>`;
});
exports.Main = Main;
