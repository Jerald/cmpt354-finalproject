function portError()
{
    console.log("[ERROR] No $PORT environment variable available to bind express to! Killing self now...");
    process.exit(1);
}
export const PORT = process.env.PORT || portError();