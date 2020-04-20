import { Client } from "pg";

import * as hbs from "hbs";
import * as express from "express";

import * as config from "./../config";
import { PostgresManager, Month, Area } from "./sql";


export class Server
{
    private readonly postgres: PostgresManager;
    private readonly express: express.Express;

    constructor(sqlClient: Client)
    {
        this.postgres = new PostgresManager(sqlClient);
        
        this.express = express();
        this.express.set("view engine", "hbs");

        hbs.registerPartials(config.VIEWS_DIR);
    }

    start(): void
    {
        this.express.use(express.json());
        this.express.use(express.urlencoded());
        this.express.use(express.static(config.SERVE_DIR));

        this.express.get("/", (req, res) => {
            res.render("index", (err: any, html: string) => {
                if (err)
                {
                    console.log("[Server] Error with html rendering: " + err);
                    return;
                }

                res.send(html);
            });
        });

        this.express.post("/sql/q1", (req, res) => {
            let month: Month | undefined = req.body?.q1_date;

            if (month == undefined)
            {
                res.json({ error: "No date supplied!" });
                return;
            }

            this.postgres.q1(month)
                .then((result) => res.json({ result }))
                .catch((error) => res.json({ error }));
        });

        this.express.post("/sql/q2", (req, res) => {
            let month: Month | undefined = req.body?.q2_date; 
            let area: Area | undefined = req.body?.q2_area;
            let first_name: string | undefined = req.body?.q2_first_name;
            let last_name: string | undefined = req.body?.q2_last_name;

            if (month && area && first_name && last_name)
            {
                this.postgres.q2(month, area, first_name, last_name)
                    .then((result) => res.json({ result }))
                    .catch((error) => res.json({ error }));
            }
            else
            {
                res.json({ error: "One of the inputs was undefined!" });
            }
        });

        this.express.post("/sql/q3", (req, res) => {
            let area: Area | undefined = req.body?.q3_area;

            if (area)
            {
                this.postgres.q3(area)
                    .then((result) => res.json({ result }))
                    .catch((error) => res.json({ error }));
            }
            else
            {
                res.json({ error: "Area was undefined!" });
            }
        });

        this.express.post("/sql/q4", (req, res) => {
            let date: Date | undefined = new Date(req.body?.q4_date);

            if (date)
            {
                this.postgres.q4(date)
                    .then((result) => res.json({ result }))
                    .catch((error) => res.json({ error }));
            }
            else
            {
                res.json({ error: "Date was undefined!" });
            }
        });

        this.express.post("/sql/q5", (req, res) => {
            let area: Area | undefined = req.body?.q5_area;

            if (area)
            {
                this.postgres.q5(area)
                    .then((result) => res.json({ result }))
                    .catch((error) => res.json({ error }));
            }
            else
            {
                res.json({ error: "Area was undefined!" });
            }
        })
        
        this.express.post("/sql_submit", (req, res) => {
            console.log("[Server] Got a sql submit...");
            console.log("[Server] Request body: " + req.body);

            if (req.body.code == "iamacode")
            {
                console.log("[Server] Sql submit code correct");

                this.postgres.client.query(req.body.sql)
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

        this.express.listen(config.PORT);
    }
}