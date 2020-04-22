import { Client, QueryResult } from "pg";

import * as hbs from "hbs";
import * as express from "express";

import * as config from "./../config";
import { PostgresManager, Month, Area } from "./sql";

// type QueryName = "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7";

function render_index(res: express.Response, locals: any): void
{
    let months: Month[] = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    let areas: Area[] = ["Computer Science", "Biology", "Chemistry", "Mathematics", "Physics"];

    locals.months = months;
    locals.areas = areas

    console.log("[render_index] Locals to render with: " + JSON.stringify(locals));

    res.render("index", locals);
}

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

        hbs.registerHelper("eq", (v1, v2) => {
            return v1 == v2;
        });

        hbs.registerHelper("index", (array, index) => {
            return array[index];
        })
    }

    start(): void
    {
        this.express.use(express.json());
        this.express.use(express.urlencoded());
        this.express.use(express.static(config.SERVE_DIR));

        this.express.get("/", (req, res) => {
            render_index(res, {});
        });

        this.express.post("/sql/q1", (req, res) => {
            let month: Month | undefined = req.body?.q1_date;

            if (month == undefined)
            {
                render_index(res, { q1_error_input: true, body: req.body })
                return;
            }

            this.postgres.q1(month)
                .then((result) => {
                    let status = result.rowCount != 0;
                    render_index(res, { q1: status, result, body: req.body, q1_error_no_results: !status });
                })
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
                    .then((result) => {
                        let status = result.rowCount != 0;
                        render_index(res, { q2: status, result, body: req.body, q2_error_no_results: !status });
                    })
                    .catch((error) => res.json({ error }));
            }
            else
            {
                render_index(res, { q2_error_input: true, body: req.body });
            }
        });

        this.express.post("/sql/q3", (req, res) => {
            let area: Area | undefined = req.body?.q3_area;

            if (area)
            {
                this.postgres.q3(area)
                    .then((result) => {
                        let status = result.rowCount != 0;
                        render_index(res, { q3: status, result, body: req.body, q3_error_no_results: !status });
                    })
                    .catch((error) => res.json({ error }));
            }
            else
            {
                render_index(res, { q3_error_input: true, body: req.body });
            }
        });

        this.express.post("/sql/q4", (req, res) => {
            let raw_date: string | undefined = req.body?.q4_date;

            if (raw_date == undefined || raw_date == "")
            {
                render_index(res, { q4_error_input: true, body: req.body });
                return;
            }

            let date: Date = new Date(raw_date);

            this.postgres.q4(date)
                .then((result) => {
                    let status = result.rowCount != 0;
                    render_index(res, { q4: status, result, body: req.body, q4_error_no_results: !status });
                })
                .catch((error) => res.json({ error }));
        });

        this.express.post("/sql/q5", (req, res) => {
            let area: Area | undefined = req.body?.q5_area;

            if (area)
            {
                this.postgres.q5(area)
                    .then((result) => {
                        let status = result.rowCount != 0;
                        render_index(res, { q5: status, result, body: req.body, q5_error_no_results: !status });
                    })
                    .catch((error) => res.json({ error }));
            }
            else
            {
                render_index(res, { q5_error_input: true, body: req.body });
            }
        });

        this.express.post("/sql/q6_query", (req, res) => {
            let proposal_id: number | undefined = req.body?.q6_proposal_id;

            if (proposal_id)
            {
                this.postgres.q6_query(proposal_id)
                    .then((result) => {
                        let status = result.rowCount != 0;
                        render_index(res, { q6_query: status, result, body: req.body, q6_error_reviewers_unavailable: !status });
                    })
                    .catch((error) => res.json({ error }));
            }
            else
            {
                render_index(res, { q6_error_input: true, body: req.body });
            }
        });

        this.express.post("/sql/q6_insert", (req, res) => {
            let proposal_id: number | undefined = req.body?.q6_proposal_id;
            let reviewers: number[] | undefined = req.body?.q6_insert_reviewers;

            if (reviewers == undefined || reviewers.length == 0)
            {
                render_index(res, { q6_error_no_reviewers_selected: true, body: req.body });
                return
            }

            if (proposal_id && reviewers)
            {
                console.log("Reviewers: " + JSON.stringify(reviewers));


                let queries = [];
                for (let i = 0; i < reviewers.length; i++)
                {
                    queries.push(this.postgres.q6_insert(proposal_id, reviewers[i]));
                }

                Promise.all(queries)
                    .then((result) => render_index(res, { q6_insert: true, body: req.body }))
                    .catch((error) => res.json({ error }));
            }
            else
            {
                render_index(res, { q6_error_input: true, body: req.body });
            }
        });

        this.express.post("/sql/q7_room_check", (req, res) => {
            let room: string | undefined = req.body?.q7_room_name;
            let raw_date: string | undefined = req.body?.q7_date;

            if (raw_date == undefined || raw_date == "" || room == undefined)
            {
                render_index(res, { q7_error_input: true, body: req.body });
                return;
            }

            let date: Date = new Date(raw_date);

            this.postgres.q7_room_check(room, date)
                .then((result) => {
                    let status = result.rowCount == 0;
                    render_index(res, { q7_room_check: status, result, body: req.body, q7_error_room_availability: !status });
                })
                .catch((error) => res.json({ text: "This is the q7 room check error", error: JSON.stringify(error) }));
        });

        this.express.post("/sql/q7_schedule_check", (req, res) => {
            let raw_date: string | undefined = req.body?.q7_date;
            let room: string | undefined = req.body?.q7_room_name;
            let calls: number[] | undefined = req.body?.q7_schedule_calls;
            
            if (raw_date == undefined || raw_date == "" || room == undefined || calls == undefined)
            {
                render_index(res, { q7_error_input: true, body: req.body });
                return;
            }

            if (calls.length != 3)
            {
                render_index(res, { q7_error_incorrect_num_calls: true, body: req.body });
            }

            console.log("[q7] Calls: '" + JSON.stringify(calls) + "'");

            let date: Date = new Date(req.body?.q7_date);

            this.postgres.q7_schedule_check(date, [ calls[0], calls[1], calls[2] ])
                .then((result) => {
                    let status = result.rowCount == 0;
                    render_index(res, { q7_schedule_check: status, q7_room_check: true, body: req.body, q7_error_schedule: !status});
                })
                .catch((error) => res.json({ error }));
        });

        this.express.post("/sql/q7_insert", (req, res) => {
            let raw_date: string | undefined = req.body?.q7_date;
            let room: string | undefined = req.body?.q7_room_name;
            let calls: number[] | undefined = req.body?.q7_schedule_calls;
            
            if (raw_date == undefined || raw_date == "" || room == undefined || calls == undefined)
            {
                render_index(res, { q7_error_input: true, body: req.body });
                return;
            }

            if (calls.length != 3)
            {
                render_index(res, { q7_error_incorrect_num_calls: true, body: req.body });
            }

            let date: Date = new Date(req.body?.q7_date);

            let queries = [];

            queries.push(this.postgres.q7_insert_meeting(room, date));
            queries.push(this.postgres.q7_insert_meeting_call(room, date, calls[0]));
            queries.push(this.postgres.q7_insert_meeting_call(room, date, calls[1]));
            queries.push(this.postgres.q7_insert_meeting_call(room, date, calls[2]));

            Promise.all(queries)
                .then((results) => render_index(res, { q7_insert: true, body: req.body }))
                .catch((error) => res.json({ error }));
        });
        
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