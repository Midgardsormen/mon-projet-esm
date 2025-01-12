"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const axios = require("axios");
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;
function escape(value, is_attr = false) {
  const str = String(value);
  const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern.lastIndex = 0;
  let escaped = "";
  let last = 0;
  while (pattern.test(str)) {
    const i = pattern.lastIndex - 1;
    const ch = str[i];
    escaped += str.substring(last, i) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i + 1;
  }
  return escaped + str.substring(last);
}
function each(items, fn) {
  items = ensure_array_like(items);
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
    );
  }
  return component;
}
let on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      // these will be immediately discarded
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
          // TODO
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean) return "";
  const assignment = `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}
axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});
const css = {
  code: "ul.svelte-ul1d7q{list-style-type:none;padding:0}li.svelte-ul1d7q{margin-bottom:1rem;border-bottom:1px solid #ccc;padding-bottom:1rem}#dynamic-input.svelte-ul1d7q{margin-top:1rem;display:block}p.svelte-ul1d7q{font-style:italic;color:#555}",
  map: null
};
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { dataForHydration } = $$props;
  let transactions = dataForHydration.transactions || [];
  let amount = 0;
  let category = "";
  let date = "";
  let dynamicText = "";
  if ($$props.dataForHydration === void 0 && $$bindings.dataForHydration && dataForHydration !== void 0) $$bindings.dataForHydration(dataForHydration);
  $$result.css.add(css);
  return `<ul class="svelte-ul1d7q">${each(transactions, (transaction) => {
    return `<li class="svelte-ul1d7q"><strong>${escape(transaction.type)}</strong>: ${escape(transaction.amount)} €
          <br>
          Catégorie: ${escape(transaction.category)} <br>
          Description: ${escape(transaction.description || "Aucune description")} <br>
          Date: ${escape(new Date(transaction.date).toLocaleDateString())} </li>`;
  })}</ul>  <div><label for="dynamic-input" data-svelte-h="svelte-19pvn2f">Test de réactivité :</label> <input id="dynamic-input" type="text" placeholder="Tapez quelque chose" class="svelte-ul1d7q"${add_attribute("value", dynamicText, 0)}> <p class="svelte-ul1d7q">Vous avez écrit : &quot;${escape("rien")}&quot;</p></div> <form><div><label for="amount" data-svelte-h="svelte-b4yj11">Montant :</label> <input id="amount" type="number" required${add_attribute("value", amount, 0)}></div> <div><label for="type" data-svelte-h="svelte-1j3kpi4">Type :</label> <select id="type" required><option value="income" data-svelte-h="svelte-oqesos">Revenu</option><option value="expense" data-svelte-h="svelte-1i7cll4">Dépense</option></select></div> <div><label for="category" data-svelte-h="svelte-cfalpp">Catégorie :</label> <input id="category" type="text" required${add_attribute("value", category, 0)}></div> <div><label for="description" data-svelte-h="svelte-yxtbzq">Description (facultatif) :</label> <textarea id="description">${escape("")}</textarea></div> <div><label for="date" data-svelte-h="svelte-1cich5g">Date :</label> <input id="date" type="date" required${add_attribute("value", date, 0)}></div> <button type="submit" data-svelte-h="svelte-1o3prbq">Ajouter la transaction</button> </form>`;
});
exports.Home = Home;
exports.create_ssr_component = create_ssr_component;
exports.escape = escape;
exports.validate_component = validate_component;
