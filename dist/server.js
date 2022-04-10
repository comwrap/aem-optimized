var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
const express = require("express");
const jsdom = require("jsdom");
const fetch = (...args) => import("node-fetch").then(({ default: fetch2 }) => fetch2(...args));
const vite = require("vite");
const { createServer } = vite;
const { JSDOM } = jsdom;
async function init(url, host, clientlib, entry, headers) {
  let page;
  try {
    page = await (await fetch(`${host}${url}`, {
      headers,
      referrer: `${host}`
    })).text();
  } catch (e) {
    console.error(e);
    return;
  }
  const dom = new JSDOM(page);
  [...dom.window.document.querySelectorAll("script")].forEach((script2) => {
    if (script2.src.startsWith("/etc.clientlibs")) {
      if (script2.src.includes(clientlib)) {
        script2.remove();
      }
      script2.src = `${host}${script2.src}`;
    }
  });
  [...dom.window.document.querySelectorAll("link")].forEach((link) => {
    if (link.href.startsWith("/etc.clientlibs")) {
      if (link.href.includes(clientlib)) {
        link.remove();
      }
      link.href = `${host}${link.href}`;
    }
  });
  const script = dom.window.document.createElement("script");
  script.setAttribute("type", "module");
  script.setAttribute("src", entry);
  const div = dom.window.document.createElement("div");
  div.setAttribute("id", "root");
  div.setAttribute("class", "app");
  dom.window.document.body.appendChild(div);
  dom.window.document.body.appendChild(script);
  return dom.serialize();
}
async function createMyServer(host, clientlibs, port, entry, headers) {
  const app = express();
  const vite2 = await createServer({
    server: { middlewareMode: "ssr" }
  });
  app.use(vite2.middlewares);
  app.use(async function(req, res, next) {
    const url = req.originalUrl;
    if (req.url === "/" || req.url.endsWith(".html")) {
      const page = await init(req.url, host, clientlibs[0], entry, headers);
      const template = await vite2.transformIndexHtml(url, page);
      res.send(template.replace("<!-- APP -->", page));
    }
    next();
  });
  app.listen(port, () => {
    console.log(`Server listening http://localhost:${port}`);
  });
}
var server_default = createMyServer;
