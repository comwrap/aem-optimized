const express = require('express');
const jsdom = require('jsdom');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const vite = require('vite');

const { createServer } = vite;
const { JSDOM } = jsdom;

async function init(url, host, clientlibs, entry, headers, wcmmode) {
  // fetch with basic auth admin:admin
  let page;
  const fetchUrl = wcmmode
    ? `${host}${url}?wcmmode=${wcmmode}`
    : `${host}${url}`;
  try {
    page = await (
      await fetch(fetchUrl, {
        headers,
        referrer: `${host}`,
      })
    ).text();
  } catch (e) {
    console.error(e);
    return;
  }
  const dom = new JSDOM(page);
  [...dom.window.document.querySelectorAll('script')].forEach((script) => {
    if (script.src.startsWith('/etc.clientlibs')) {
      for (const clientlib of clientlibs) {
        if (script.src.includes(clientlib)) {
          script.remove();
        }
      }
      script.src = `${host}${script.src}`;
    }
  });

  [...dom.window.document.querySelectorAll('link')].forEach((link) => {
    if (link.href.startsWith('/etc.clientlibs')) {
      for (const clientlib of clientlibs) {
        if (link.href.includes(clientlib)) {
          link.remove();
        }
      }
      link.href = `${host}${link.href}`;
    }
  });

  const script = dom.window.document.createElement('script');
  script.setAttribute('type', 'module');
  script.setAttribute('src', entry);

  const div = dom.window.document.createElement('div');
  div.setAttribute('id', 'root');
  div.setAttribute('class', 'app');
  dom.window.document.body.appendChild(div);
  dom.window.document.body.appendChild(script);

  return dom.serialize();
}

async function createMyServer(
  host,
  clientlibs,
  port,
  entry,
  headers,
  wcmmode = null
) {
  const app = express();

  // Create Vite server in middleware mode. This disables Vite's own HTML
  // serving logic and let the parent server take control.
  //
  // In middleware mode, if you want to use Vite's own HTML serving logic
  // use `'html'` as the `middlewareMode` (ref https://vitejs.dev/config/#server-middlewaremode)
  const vite = await createServer({
    server: { middlewareMode: 'ssr' },
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);
  app.use(async function (req, res, next) {
    const url = req.originalUrl;
    const reg = new RegExp(/.*(\/|\.html|\.html\?.*)$/i);
    if (req.url === '/' || reg.test(req.url)) {
      const page = await init(
        req.url,
        host,
        clientlibs,
        entry,
        headers,
        wcmmode
      );
      const template = await vite.transformIndexHtml(url, page);

      res.send(template.replace('<!-- APP -->', page));
    }

    next();
  });

  app.listen(port, () => {
    console.log(`Server listening http://localhost:${port}`);
  });
}
// const createMyServer = () => {};
export default createMyServer;
