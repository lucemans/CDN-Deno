import { listenAndServe, ServerRequest } from 'https://deno.land/std/http/server.ts';
import { existsSync, walkSync, ensureDir, ensureDirSync } from "https://deno.land/std/fs/mod.ts";

const defaultDir = "/data";
ensureDirSync(defaultDir);

listenAndServe({port: 8000}, async (req: ServerRequest) => {
    try {
        let filename = (req.url.startsWith('/') ? '' : '/') + req.url;
        let raw = false;
        if (filename.startsWith('/raw/')) {
            filename = filename.substr(('/raw').length);
            raw = true;
        }
        if (!raw && !req.headers.has('cache-control')) {
            raw = true;
        }
        filename = defaultDir + filename;
        if (existsSync(filename)) {
            const info = await Deno.stat(filename);
            if (info.isFile) {
                req.respond({body: (
                    raw ? 
                    Deno.readFileSync(filename) :
                    Deno.readTextFileSync('./src/index.html').replace(/\{\{contentRaw\}\}/g, filename.replace(defaultDir + '/', '/raw/'))
                )});
                return;
            }
            if (info.isDirectory) {
                const files = [];
                for (const entry of Deno.readDirSync(filename)) {
                        files.push(entry.name);
                }
                req.respond({body: "Files in this dir: \n" + files.join('\n')});
                return;
            }
            req.respond({body: "found " + filename});
            return;
        }
        if (req.url.match(/\/healthz/g)) {
            req.respond({status: 200, body: new TextEncoder().encode("200 OK")});
            return;
        }
        req.respond({status: 404});
    } catch (error) {
        console.log(error);
        req.respond({status: 500})
    }
});