import { listenAndServe, ServerRequest } from 'https://deno.land/std/http/server.ts';
import { existsSync, walkSync, ensureDir, ensureDirSync } from "https://deno.land/std/fs/mod.ts";

const defaultDir = "."; //"/data";
ensureDirSync(defaultDir);

listenAndServe({port: 8000}, async (req: ServerRequest) => {
    try {
        let filename = defaultDir + (req.url.startsWith('/') ? '' : '/') + req.url; 
        const raw = req.headers.has('cache-control') ? (filename.startsWith('./raw/')) : true;
        
        if (filename.startsWith('./raw/')) {
            filename = filename.substr('./raw/'.length);
        }

        if (existsSync(filename)) {
            const info = await Deno.stat(filename);
            if (info.isDirectory) {
                const files = [];
                for (const entry of Deno.readDirSync(filename)) {
                        console.log('found ' + entry.name);
                        files.push(entry.name);
                }
                req.respond({body: "Files in this dir: \n" + files.join('\n')});
                return;
            }
            if (info.isFile) {
                    req.respond({body: (
                        raw ? 
                        Deno.readFileSync(filename) :
                        "This is a file"
                    )});
                return;
            }
            req.respond({body: "found " + filename});
            return;
        }
        req.respond({status: 404});
    } catch (error) {
        console.log(error);
        req.respond({status: 500})
    }
});