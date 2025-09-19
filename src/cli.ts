#!/usr/bin/env node

import { Command } from "commander";
import { createLiveReloadServer, PathMapping } from "./index.js";

const program = new Command();

program
   .name("hotserve")
   .description("Minimal hot-reload development server")
   .version("0.1.0")
   .option("-p, --port <port>", "port to run server on", "4000")
   .option(
      "--path <mapping>",
      "path mapping in format 'local-dir:route'",
      (value, previous: PathMapping[]) => {
         const [localPath, route = "/"] = value.split(":");
         return [...(previous || []), { localPath, route }];
      },
      [] as PathMapping[],
   )
   .option("-v, --verbose", "verbose output", false)
   .action((options) => {
      const port = parseInt(options.port);

      // Default to current directory if no paths specified
      const paths = options.path.length > 0 ? options.path : [{ localPath: ".", route: "/" }];

      const server = createLiveReloadServer({
         port,
         paths,
         verbose: options.verbose,
      });

      server.start();

      process.on("SIGINT", () => {
         console.log("\nShutting down...");
         server.stop();
         process.exit(0);
      });
   });

program.parse();
