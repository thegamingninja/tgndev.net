import {
    Context, 
    fs,
} from '../deps.ts';

import {
    Page
} from '../api.ts';

import { Marked } from 'https://deno.land/x/markdown/mod.ts';

const SITE_CONFIG = await fs.readJson(`${Deno.cwd()}/site.json`);

export default async (ctx: Context, next: any) => {
    const page: Page = await ctx.app.state['pageStore'].get(ctx.request.url.pathname);

    if (page) {
        const theme = ctx.app.state['theme'];

        const content: string = page.type == 'markdown' 
            ? Marked.parse(page.content ?? '')
            : await theme.engine.render(page.content ?? '', {})

        ctx.response.body = await theme.engine.render(page.style, { site: SITE_CONFIG, page, content });
        ctx.response.headers.set('Content-Type', 'text/html');
        ctx.response.status = 200;

        return;
    }

    await next();
}