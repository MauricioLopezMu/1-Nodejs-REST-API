const http = require('http');
const { bodyParser } = require('./lib/bodyParser')

let database = [];

function getTaskHandler(req, res) { 
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(database));
    res.end();
}

async function createTaskHandler(req, res) {
    try{
        await bodyParser(req)
        database.push(req.body);
        console.log(req.body);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(database));
        res.end();
    }catch{
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("Invalid Data");
        res.end();
    }
}

async function updateTaskHandler(req, res) {
    try{
        let {url} = req;
    
    let idQuery = url.split("?")[1];
    let idkey = idQuery.split("=")[0];
    let idValue = idQuery.split("=")[1];

    if (idkey === "id"){
        await bodyParser(req);

        database[idValue - 1] = req.body;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(database));
        res.end();
    } else{
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Invalid Request Query');
        res.end(); 
    }
    }catch{
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Invalid Body Data was provided', error.message);
        res.end(); 
    }
}

async function deleteTaskHandler(req, res){
    let { url } = req;
    
    let idQuery = url.split("?")[1];
    let idkey = idQuery.split("=")[0];
    let idValue = idQuery.split("=")[1];

    if (idkey === 'id') {
        database.splice(idValue - 1, 1);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('DELETE Successfully');
        res.end(); 
    }else{
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write('Invalid Query');
        res.end(); 
    }
}

const server = http.createServer((req, res) => {

    const { url, method } = req;

    // Logger
    console.log(`URL: ${url} - Method: ${method}`);


    switch(method){
        case "GET":
            if (url === "/"){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({message: 'Hello World'}));
                res.end();
            }
            if(url === "/tasks"){
             getTaskHandler(req, res);   
            }
        break;
        case "POST":
            if(url === "/tasks"){
            createTaskHandler(req, res); 
            }
        break;
        case "PUT":
            updateTaskHandler(req, res);
        break;
        case "DELETE":
            deleteTaskHandler(req, res);
        break;
        default:
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('404 NOT FOUND');
            res.end(); 

    }


});

server.listen(3000);
console.log('Server on port', 3000);