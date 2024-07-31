# vite-plugin-remix-server-bundle

Use this plugin to create a `build/server.js` when building your app which can be executed via `PORT=1234 node build/server.js`,
without installing any deps first.

## Install

```shell
pnpm add @lamsal-de/vite-plugin-remix-server-bundle
```

## Usage

Add the plugin to your `vite.config.ts`. After building via vite, you can run your `build/server.js` file 
**by setting the PORT env variable first**. 

Given you are using remix, this is the minimal config:

```ts
import { vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import { remixServerBundle } from "@lamsal-de/vite-plugin-remix-server-bundle"

export default defineConfig({
    plugins: [
        remix(),
        remixServerBundle()
    ],
})
```

## How

No configuration; when adding this plugin to your `vite.config.ts#plugins` array (__after__ the remix plugin) you will get
an additional file `build/server.js` in your `build` directory which is the bundled and ready-to-go entrypoint for your remix app.

This is achieved by bundling a file which creates an express server which serves the remix app, using remix' express adapter.
