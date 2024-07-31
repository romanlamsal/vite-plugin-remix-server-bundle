import { existsSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"
import { PluginOption } from "vite"

export const remixServerBundle = (): PluginOption => ({
    name: "remix-server-bundle",
    async closeBundle() {
        if (!existsSync(join("./build", "server", "index.js"))) {
            return
        }

        await build({
            bundle: true,
            outfile: join("./build", "server.js"),
            platform: "node",
            stdin: {
                loader: "ts",
                resolveDir: "./build",
                contents: `
import * as build from "./server/index.js"
import { createRequestHandler } from "@remix-run/express"
import express from "express"
import process from "node:process"
import { join } from "node:path"

const app = express()

app.use(express.static(join(__dirname, "./client"), { maxAge: "1h" }))

app.all(
    "*",
    createRequestHandler({
        build,
        // build: { ...build, assetsBuildDirectory: "client" },
        getLoadContext() {
            return {}
        },
    })
)

if (process.env.PORT) {
    app.listen(process.env.PORT, () => { console.log("Started on port", process.env.PORT) })
}
`.trim(),
            },
            plugins: [
                {
                    name: "manual-express",
                    setup(build) {
                        build.onResolve({ filter: /^express(\/*)$/ }, args => ({
                            path: fileURLToPath(import.meta.resolve(args.path)),
                        }))
                        build.onResolve({ filter: /^@remix-run\/express(\/*)$/ }, args => ({
                            path: fileURLToPath(import.meta.resolve(args.path)),
                        }))
                    },
                },
            ],
        })
    },
})

export default remixServerBundle
