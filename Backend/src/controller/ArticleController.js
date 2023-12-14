const  Article  = require("../model/articleSchema");
const  AuthorController  = require("../controller/AuthorController")
const path = require('path');
var fs = require('fs');
const User = require("../model/userSchema");


class ArticleController {
  static createLog(error) {
    const timestamp = Date.now();
    const archivePath = path.resolve(__dirname, "..", `logs-${timestamp}.txt`);
    const errorString = JSON.stringify(error.message);
    fs.writeFile(archivePath, errorString, function (err, result) {
      if (err) console.log(err);
    });
  }
  static async create(req, res) {
    const { title, text, authorid } = req.body;
    if (!title || !text || !authorid)
      return res
        .status(400)
        .send({ message: "os campos não podem estarem vazios " });

    if (title.length < 3)
      return res
        .status(400)
        .send({ message: "o titulo não pode ser menor que 3 caracteres" });
    if (text.length < 15)
      return res
        .status(400)
        .send({ message: "o artigo não pode ser menor que 15 caracteres" });
    try {
      const author = await AuthorController.getAuthor(authorid);
      const article = {
        title,
        text,
        likes: 0,
        author,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        removedAt: null,
      };
      await Article.create(article);
      return res.status(201).send({ message: "Artigo criado com sucesso" });
    } catch (error) {
      ArticleController.createLog(error);
      return res
        .status(500)
        .send({ error: "Falha ao salvar o artigo", data: error.message });
    }
  }

  static async likeArticle(req, res){
    const { like } = req.params;
    const { id } = req.params;

    const article = await Article.findById(like);
    if(!article)
      return res.status(400).send({ message : "inválido article" })

    const isUser = await User.findById(id);
    if(!isUser)
      return res.status(400).send({ message : "inválido user" })
  
    if(!id)
    return res.status(400).send({ message: "No id provider" })

    try {

      if (article.likes.includes(isUser))
      {
        var indexOf = article.likes.indexOf(isUser)
        // article.likes.splice(indexOf, 1)
        await Article.findByIdAndUpdate(
          {_id: id}, 
          {$addToSet: {likes: isUser}},
          {likes: article.likes.splice(indexOf, 1)})
      }
      else 
      {
        await Article.findByIdAndUpdate(
          {_id: id}, 
          {$addToSet: {likes: isUser}},
          {likes: article.likes.push(isUser)})
          // article.likes.push(isUser)
      }
      
    
    // await Article.findByIdAndUpdate() 
    
    return res.status(200).send();
    } 
    
    catch (error) {
    ArticleController.createLog(error);
    return res.status(500).send({ error: "Falha ao curtir", data: error.message })
    }
    }

}

module.exports = ArticleController;
