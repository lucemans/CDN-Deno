import { listenAndServe, ServerRequest } from 'https://deno.land/std/http/server.ts';
import { existsSync } from "https://deno.land/std/fs/mod.ts";

listenAndServe({port: 8000}, async (req: ServerRequest) => {
    try {
        let filename = (req.url.startsWith('/') ? '' : '/') + req.url; 
        
        req.respond({body: "Hello"});
    } catch (error) {
        req.respond({status: 404})
    }
});