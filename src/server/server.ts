import { Client } from "pg";

import * as express from "express";

import * as config from "./../config";

export class Server
{
    private readonly sqlClient: Client;
    private readonly express: express.Express;

    constructor(sqlClient: Client)
    {
        this.sqlClient = sqlClient;
        this.express = express();
    }

    start(): void
    {
        this.express.get("/index", (req, res) => {
            res.sendFile("/html/index.html", { root: config.SERVE_DIR });
        });
        
        // this.express.post("/sql_submit", (req, res) => {
        //     if (req.body.code == "iamacode")
        //     {
        //         this.sqlClient.query(req.body.sql)
        //             .then((result: any[]) => {
        //                 console.log("Query result: " + JSON.stringify(result));
        //                 res.end("boop");
        //             })
        //             .catch((error: any) => {
        //                 console.log("Query error: " + JSON.stringify(error));
        //                 res.end("boop");
        //             });
        //     }
        //     else
        //     {
        //         res.end("Bad boop!");
        //     }
        // });

        this.express.use(express.json());
        this.express.listen(config.PORT);
    }
}