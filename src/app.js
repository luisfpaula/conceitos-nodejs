const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//Middleware validação ID
function validateRepId(req, res, next){
  const { id } = req.params;

  if(!isUuid(id)){
    return res.send(400).json({ error: 'Invalid repository ID.'});
  }
  const repIndex  = repositories.findIndex( repository => repository.id === id);
  
  if( repIndex < 0){
    return res.send(400).json({ error: "Project not found!"});
  }
    
  return next();  
}

app.use('/repositories/:id', validateRepId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const likes = 0;
  const repository = { id: uuid(), title, url, techs, likes };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repIndex  = repositories.findIndex( repository => repository.id === id);
  let repOld = repositories[repIndex];

  if(repOld.title !== title){
    repOld.title = title;
  }

  if(repOld.url !== url){
    repOld.url = url;
  }

  if(repOld.techs !== techs){
    repOld.techs = techs;
  }
  
  repositories[repIndex] = repOld;

  return response.status(200).json(repOld);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repIndex  = repositories.findIndex( repository => repository.id === id);

  repositories.splice(repIndex, 1);

  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repIndex  = repositories.findIndex( repository => repository.id === id);

  let repOld = repositories[repIndex];

  repOld.likes = repOld.likes + 1;

  return response.status(200).json(repOld);
});

module.exports = app;
