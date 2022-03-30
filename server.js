import express from 'express';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import vite from 'vite';

const { createServer: createViteServer } = vite;
async function init(url, host, clientlib) {
  // fetch with basic auth admin:admin
  let page;
  try {
    page = await (
      await fetch(`${host}${url}`, {
        headers: {
          authorization: 'Basic YWRtaW46YWRtaW4=',
        },
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
      if (script.src.includes(clientlib)) {
        script.remove();
      }
      script.src = `${host}${script.src}`;
    }
  });

  [...dom.window.document.querySelectorAll('link')].forEach((link) => {
    if (link.href.startsWith('/etc.clientlibs')) {
      if (link.href.includes(clientlib)) {
        link.remove();
      }
      link.href = `${host}${link.href}`;
    }
  });

  [...dom.window.document.querySelectorAll('img')].forEach((img) => {
    img.src = `${host}${img.src}`;
  });
  [...dom.window.document.querySelectorAll('[data-cmp-lazy]')].forEach(
    (img) => {
      img.setAttribute(
        'data-cmp-src',
        `${host}${img.getAttribute('data-cmp-src')}`
      );
    }
  );
  // [...dom.window.document.querySelectorAll('*')].forEach((el) => {
  //   if (dom.window.getComputedStyle(el).backgroundImage === 'none') {
  //     // console.log('bg: ', dom.window.getComputedStyle(el).backgroundImage);
  //     // el.style.backgroundImage = `url(${host}${dom.window
  //     //   .getComputedStyle(el)
  //     //   .backgroundImage.slice(4, -1)})`;
  //   }
  // });

  var script = dom.window.document.createElement('script');
  script.setAttribute('type', 'module');
  script.setAttribute('src', '/src/main/webpack/site/main.js');

  const div = dom.window.document.createElement('div');
  div.setAttribute('id', 'root');
  div.setAttribute('class', 'app');
  dom.window.document.body.appendChild(div);
  dom.window.document.body.appendChild(script);

  return dom.serialize();
}

async function createServer(host, clientlibs, port) {
  const app = express();

  // Create Vite server in middleware mode. This disables Vite's own HTML
  // serving logic and let the parent server take control.
  //
  // In middleware mode, if you want to use Vite's own HTML serving logic
  // use `'html'` as the `middlewareMode` (ref https://vitejs.dev/config/#server-middlewaremode)
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' },
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use(async function (req, res, next) {
    const url = req.originalUrl;
    if (
      req.url === '/' ||
      req.url.endsWith('.html') ||
      req.url.includes('.html?')
    ) {
      const page = await init(req.url, host, clientlibs[0]);
      const template = await vite.transformIndexHtml(url, page);

      res.send(template.replace('<!-- APP -->', page));
    }
    if (req.url.startsWith('/etc.')) {
      // console.log(req.url);
      console.log(req);
      res.send(`${host}${req.url}`);
    }

    next();
  });

  app.listen(port, () => {
    console.log(`Server listening http://localhost:${port}`);
  });
}

export { createServer };
