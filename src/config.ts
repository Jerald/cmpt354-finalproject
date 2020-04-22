function databaseURLError(): undefined
{
    console.log("[ERROR] No $DATABASE_URL environment variable available to connect to the database with! Killing self now...");
    process.exit(1);
}
export const DATABASE_URL = process.env.DATABASE_URL || databaseURLError();

function portError(): undefined
{
    console.log("[ERROR] No $PORT environment variable available to bind express to! Killing self now...");
    process.exit(1);
}
export const PORT = process.env.PORT || portError();

export const SERVE_DIR = __dirname + "/../public";

export const SQL_DIR = __dirname + "/../sql";

export const VIEWS_DIR = __dirname + "/../views";