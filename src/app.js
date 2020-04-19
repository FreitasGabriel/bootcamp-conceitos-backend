const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (req, res) => {

  const {title } = req.query;
  
  const results = title 
  ? repositories.filter(repository => repository.title.includes(title)) : repositories

  return res.status(200).json(results)
});

app.post("/repositories", (req, res) => {
  
  const {title, url, techs} = req.body

  const repository = {id: uuid(), title, url, techs, likes: 0}

  repositories.push(repository)

  return res.status(200).json(repository)

});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params
  const {title, url, techs, likes} = req.body;

  if(likes){
    return res.json({likes: 0})
  }
  
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if(repoIndex < 0) {
    return res.status(400).json({error:"Project not found"})
  }

  const repository = {
    id, title, url, techs
  }

  repositories[repoIndex] = repository

  return res.status(201).json(repository)

});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return res.status(400).json({error: "Project not found"})
  }

  repositories.splice(repoIndex, 1)

  return res.status(204).send()

});

app.post("/repositories/:id/like",  (req, res) => {
    
  const { id } = req.params
  
  const repository = repositories.find(repo => repo.id === id)
   
  if (!repository) {
    return res.status(400).json({error: "Repository does not exist"})
  }

  repository.likes +=1

  return res.json(repository)

});

module.exports = app;
