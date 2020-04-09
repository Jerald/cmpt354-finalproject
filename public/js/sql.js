function init()
{
    $("#submit").click(function (event)
    {
        console.log("Form submitted...");

        if (event)
        {
            event.preventDefault();
        }

        let data = {
            sql: $("#sql").val(),
            code: $("#code").val()
        };

        $.ajax({
            method: "post",
            url: "/sql_submit",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(data),
            success: () => { console.log("Form submission success!") }
        });
    });
}