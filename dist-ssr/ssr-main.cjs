"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const axios = require("axios");
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
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
    if (name === "svelte:component") name += " this={...}";
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
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
const transactions = writable([]);
const TransactionCreationForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let amount = 0;
  let category = "";
  let date = "";
  return `<form><div><label for="amount" data-svelte-h="svelte-b4yj11">Montant :</label> <input id="amount" type="number" required${add_attribute("value", amount, 0)}></div> <div><label for="type" data-svelte-h="svelte-1j3kpi4">Type :</label> <select id="type" required><option value="income" data-svelte-h="svelte-oqesos">Revenu</option><option value="expense" data-svelte-h="svelte-1i7cll4">Dépense</option></select></div> <div><label for="category" data-svelte-h="svelte-cfalpp">Catégorie :</label> <input id="category" type="text" required${add_attribute("value", category, 0)}></div> <div><label for="description" data-svelte-h="svelte-yxtbzq">Description (facultatif) :</label> <textarea id="description">${escape("")}</textarea></div> <div><label for="date" data-svelte-h="svelte-1cich5g">Date :</label> <input id="date" type="date" required${add_attribute("value", date, 0)}></div> <button type="submit" data-svelte-h="svelte-1o3prbq">Ajouter la transaction</button></form>`;
});
const css = {
  code: "ul.svelte-1pm7pxr{list-style-type:none;padding:0}li.svelte-1pm7pxr{margin-bottom:1rem;border-bottom:1px solid #ccc;padding-bottom:1rem}",
  map: null
};
const TransactionListTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $transactions, $$unsubscribe_transactions;
  $$unsubscribe_transactions = subscribe(transactions, (value) => $transactions = value);
  $$result.css.add(css);
  $$unsubscribe_transactions();
  return `<ul class="svelte-1pm7pxr">${each($transactions, (transaction) => {
    return `<li class="svelte-1pm7pxr"><strong>${escape(transaction.type)}</strong>: ${escape(transaction.amount)} €
          <br>
          Catégorie: ${escape(transaction.category)} <br>
          Description: ${escape(transaction.description || "Aucune description")} <br>
          Date: ${escape(new Date(transaction.date).toLocaleDateString())} </li>`;
  })} </ul>`;
});
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div>${validate_component(TransactionListTable, "TransactionListTable").$$render($$result, {}, {}, {})} ${validate_component(TransactionCreationForm, "TransactionCreationForm").$$render($$result, {}, {}, {})}</div>`;
});
const Main = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { dataForHydration } = $$props;
  console.log("++++++++++++++++", dataForHydration);
  if ($$props.dataForHydration === void 0 && $$bindings.dataForHydration && dataForHydration !== void 0) $$bindings.dataForHydration(dataForHydration);
  return `<main><h1>${escape(dataForHydration.message)}</h1> <div id="app">${validate_component(Board, "Board").$$render($$result, {}, {}, {})}</div></main>`;
});
exports.Main = Main;
