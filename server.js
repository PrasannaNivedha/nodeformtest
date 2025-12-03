const fs = require("fs");
const http = require("http");
const path = require("path");

const server = http.createServer((req,res)=>{
    
    //Testing loggers:
    console.log(req.url, req.method);
    
    //webpage giving to front end
    if(req.method=="GET" && req.url=="/")
    {
        let pathway = path.join(__dirname, "index.html");
        fs.readFile(pathway, "utf8", (err,data)=>{
            if (err)
            {
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.end("Failed to serve page");
            }
            else
            {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end(data);
            }
        });
        return;
    }


    // saves data and creates file
    else if (req.method=="POST")
    {
        let body = '';
        req.on("data", chunk => {body += chunk} );

        req.on("end", ()=> {
            let data = JSON.parse(body);

            fs.appendFile("data.json", JSON.stringify(data)+"\n", (err)=>{
                if(err)
                {
                    res.writeHead(500, {"Content-Type": "text/plain"});
                    res.end("Failed to save");
                }
                else
                {
                    res.writeHead(200, {"Content-Type": "text/plain"});
                    res.end("Saved Successfully!!");

                }
            })
        });
        return;


    }

    // retrieves data from json file
    else if (req.method=="GET" && req.url=="/retrieve")
    {
        fs.readFile("data.json", "utf8", (err,filedata)=>{
            if (err)
            {
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.end("could not read file");
            }
            else
            {
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end(filedata);

            }
        });
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>console.log("Server turned on", PORT));