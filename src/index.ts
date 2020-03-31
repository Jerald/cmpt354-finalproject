import * as pg from "pg";
const Client = pg.Client;

async function main(): Promise<void>
{
    console.log(`
    Database url: ${process.env.DATABASE_URL}
    `);

    let client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });

    try
    {
        console.log("[Main] Trying to connect to client...");
        await client.connect();
    }
    catch (error)
    {
        console.log(`[Main] Client connection error: ${error}`);
    }

    console.log("[Main] Successfully connected to client!");
}

main().then(() => {
    console.log("SUCCESS");
}).catch(() => {
    console.log("FAILURE");
});

