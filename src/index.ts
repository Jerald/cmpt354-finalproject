import * as pg from "pg";
const Client = pg.Client;

import * as express from "express";
const server = express();

import * as config from "./config";

async function main(): Promise<void>
{
    server.get("/index", (req, res) => {
        res.sendFile("../html/index.html", { root: __dirname });
    })

    server.post("/sql_submit", (req, res) => {
        if (req.body.code == "iamacode")
        {
            client.query(req.body.sql)
                .then((result: any[]) => {
                    console.log("Query result: " + JSON.stringify(result));
                    res.end("boop");
                })
                .catch((error: any) => {
                    console.log("Query error: " + JSON.stringify(error));
                    res.end("boop");
                });
        }
        else
        {
            res.end("Bad boop!");
        }
    });
    
    server.use(express.json());
    server.listen(config.PORT);

    let client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        }
    });

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

