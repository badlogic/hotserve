import express from "express";
import { WebSocketServer } from "ws";
import chokidar from "chokidar";
import path from "path";
import fs from "fs";
import { createServer } from "http";

export interface PathMapping {
   localPath: string;
   route: string;
}

export interface ServerOptions {
   port: number;
   paths: PathMapping[];
   verbose?: boolean;
}

const INJECT_SCRIPT = `
<script>
(function() {
   const ws = new WebSocket('ws://localhost:PORT/__/live-reload');
   ws.onmessage = (event) => {
      if (event.data === 'reload') {
         location.reload();
      }
   };
   ws.onclose = () => {
      setTimeout(() => location.reload(), 1000);
   };
})();
</script>
`;

export function createLiveReloadServer(options: ServerOptions) {
   const app = express();
   const server = createServer(app);
   const wss = new WebSocketServer({ server, path: "/__/live-reload" });

   const clients = new Set<any>();

   // WebSocket connections
   wss.on("connection", (ws) => {
      clients.add(ws);
      if (options.verbose) console.log("Client connected");

      ws.on("close", () => {
         clients.delete(ws);
         if (options.verbose) console.log("Client disconnected");
      });
   });

   // Broadcast reload to all clients
   const reload = () => {
      if (options.verbose) console.log("Reloading clients...");
      clients.forEach((client) => {
         if (client.readyState === 1) {
            client.send("reload");
         }
      });
   };

   // Set up file watchers
   const watchPaths = options.paths.map((p) => p.localPath);
   const watcher = chokidar.watch(watchPaths, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
   });

   watcher.on("change", (filePath) => {
      if (options.verbose) console.log(`File changed: ${filePath}`);
      reload();
   });

   // Inject script middleware for HTML files
   const injectScript = (html: string): string => {
      const script = INJECT_SCRIPT.replace("PORT", options.port.toString());
      const bodyIndex = html.lastIndexOf("</body>");
      if (bodyIndex !== -1) {
         return html.slice(0, bodyIndex) + script + html.slice(bodyIndex);
      }
      return html + script;
   };

   // Set up static file serving with cache busting
   options.paths.forEach(({ localPath, route }) => {
      app.use(
         route,
         (req, res, next) => {
            // Disable caching
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            res.setHeader("Surrogate-Control", "no-store");

            // Handle HTML files specially
            if (req.path.endsWith(".html") || req.path === "/") {
               const filePath = path.join(localPath, req.path === "/" ? "index.html" : req.path);

               fs.readFile(filePath, "utf8", (err, data) => {
                  if (err) {
                     next();
                     return;
                  }
                  const injected = injectScript(data);
                  res.setHeader("Content-Type", "text/html");
                  res.send(injected);
               });
            } else {
               next();
            }
         },
         express.static(localPath),
      );
   });

   return {
      start: () => {
         server.listen(options.port, () => {
            console.log(`Live reload server running on http://localhost:${options.port}`);
            options.paths.forEach(({ localPath, route }) => {
               console.log(`  ${route} → ${path.resolve(localPath)}`);
            });
         });
      },
      stop: () => {
         watcher.close();
         server.close();
      },
   };
}
