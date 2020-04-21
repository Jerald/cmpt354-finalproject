import { readFile } from "fs";

import * as pg from "pg";

import { SQL_DIR } from "../config";

export type Month = "January" | "February" | "March" | "April" | "May" | "June" | "July" |
    "August" | "September" | "October" | "November" | "December";

function month_to_number(month: Month): number
{
    return (new Date(month + "1, 2020")).getMonth();
}

function make_query(text: string, values: any[])
{
    return {
        text,
        values,
        rowMode: "array"
    }
}

export type Area = "Computer Science" | "Biology" | "Chemistry" | "Mathematics" | "Physics";

export class PostgresManager
{
    static q1_sql: string = "";
    static q2_sql: string = "";
    static q3_sql: string = "";
    static q4_sql: string = "";
    static q5_sql: string = "";
    static q6_query_sql: string = "";
    static q6_insert_sql: string = "";
    static q7_sql: string = "";

    readonly client: pg.Client;

    constructor(client: pg.Client)
    {
        this.client = client;
    }

    async q1(month: Month)
    {
        let date = (new Date()).setMonth(month_to_number(month));
        let query = make_query(PostgresManager.q1_sql, [ date ]);
        
        return this.client.query(query);
    }

    async q2(month: Month, area: Area, first_name: string, last_name: string)
    {
        let date = (new Date()).setMonth(month_to_number(month));
        let query = make_query(PostgresManager.q2_sql, [ date, area, first_name, last_name ]);

        return this.client.query(query);
    }

    async q3(area: Area)
    {
        let query = make_query(PostgresManager.q3_sql, [ area ]);
        return this.client.query(query);
    }

    async q4(date: Date)
    {
        let query = make_query(PostgresManager.q4_sql, [ (date.getTime() / 1000) ]);
        return this.client.query(query);
    }

    async q5(area: Area) 
    {
        let query = make_query(PostgresManager.q5_sql, [ area ]);
        return this.client.query(query);
    }

    async q6_query(proposal_id: number)
    {
        let query = make_query(PostgresManager.q6_query_sql, [ proposal_id ]);
        return this.client.query(query);
    }

    async q6_insert(proposal_id: number, reviewer_id: number)
    {
        let query = make_query(PostgresManager.q6_insert_sql, [ proposal_id, reviewer_id ]);
        return this.client.query(query);
    }
}

(function ()
{
    type Prop = "q1_sql" | "q2_sql" | "q3_sql" | "q4_sql" | "q5_sql" | "q6_query_sql" | "q6_insert_sql" | "q7_sql";
    
    function loadSql(propName: Prop)
    {
        readFile(SQL_DIR + "/" + propName.replace("_sql", ".sql"), (err, file) => {
            if (err)
            {
                console.log("Error doing static loading of SQL file for: " + propName);
                process.exit(1);
            }

            PostgresManager[propName] = file.toString();
        })
    }

    loadSql("q1_sql");
    loadSql("q2_sql");
    loadSql("q3_sql");
    loadSql("q4_sql");
    loadSql("q5_sql");
    loadSql("q6_query_sql");
    loadSql("q6_insert_sql");
})()