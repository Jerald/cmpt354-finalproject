import * as pg from "pg";
const Client = pg.Client;

import * as express from "express";

async function main(): Promise<void>
{
    let client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        }
    });

    let server = express();

    server.get("/", (req, res) => res.send("Hello world!"));
    server.listen(15640);

    try
    {
        console.log("[Main] Trying to connect to client...");
        await client.connect();
        console.log("[Main] Successfully connected to client!");
        await client.end();
    }
    catch (error)
    {
        console.log(`[Main] Client connection error: ${error}`);
    }
}

main().then(() => {
    console.log("SUCCESS");
}).catch(() => {
    console.log("FAILURE");
});

