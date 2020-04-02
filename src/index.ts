import * as pg from "pg";
const Client = pg.Client;

import * as config from "./config";
import { Server } from "./server/server";

async function main(): Promise<void>
{
    let client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        }
    });

    let server = new Server(client);
    server.start();

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

