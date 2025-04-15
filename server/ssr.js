import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const app = express();
let vite;

if (!isProd) {
    const { createServer } = await import('vite');
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
    });
    app.use(vite.middlewares);
} else {
    app.use(
        express.static(path.resolve(__dirname, '../dist/client'), {
            index: false,
        })
    );
}

app.use('*', async (req, res) => {
    const url = req.originalUrl;

    try {
        let template, render;

        if (!isProd) {
            template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
            template = await vite.transformIndexHtml(url, template);
            render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
        } else {
            template = fs.readFileSync(path.resolve(__dirname, '../dist/client/index.html'), 'utf-8');
            render = (await import('../dist/server/entry-server.js')).render;
        }

        const { html } = await render();

        const $ = cheerio.load(template);
        $('#root').html(html);

        if (isProd) {
            const manifest = JSON.parse(
                fs.readFileSync(path.resolve(__dirname, '../dist/client/manifest.json'), 'utf-8')
            );
            const clientEntry = Object.values(manifest).find((entry) => entry.isEntry);
            const clientScript = clientEntry.file;
            $('body').append(`<script type="module" src="/${clientScript}"></script>`);
        }

        const finalHtml = $.html();
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    } catch (e) {
        vite?.ssrFixStacktrace(e);
        console.error(e);
        res.status(500).end(e.message);
    }
});

export default app;