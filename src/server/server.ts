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
        this.express.get("/", (req, res) => {
            res.redirect("/html/index.html");
        });

        this.express.get("/public/js/index.js", (req, res) => {
            res.sendFile("/js/index")
        });
        
        this.express.post("/sql_submit", (req, res) => {
            console.log("[Server] Got a sql submit...");
            if (req.body.code == "iamacode")
            {
                console.log("[Server] Sql submit code correct");

                this.sqlClient.query(req.body.sql)
                    .then((result: any[]) => {
                        console.log("[Server] Sql submit query result: " + JSON.stringify(result));
                        res.end("boop");
                    })
                    .catch((error: any) => {
                        console.log("[Server] Sql submit query error: " + JSON.stringify(error));
                        res.end("boop");
                    });
            }
            else
            {
                console.log("[Server] Sql submit code WRONG");
                res.end("Bad boop!");
            }
        });

        this.express.use(express.json());
        this.express.use(express.static(config.SERVE_DIR));

        this.express.listen(config.PORT);
    }
}