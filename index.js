const express = require("express");
const app = express();

const mongoose = require("mongoose");
const User = require("./users");

const PORT = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost:27017/paginatedapi");

const db = mongoose.connection;
db.once("open", async()=>{
    if(await User.countDocuments().exec()>0) return

    Promise.all([
        User.create({"id": 1, "name":  "user1"}),
        User.create({"id": 2, "name":  "user2"}),
        User.create({"id": 3, "name":  "user3"}),
        User.create({"id": 4, "name":  "user4"}),
        User.create({"id": 5, "name":  "user5"}),
        User.create({"id": 6, "name":  "user6"}),
        User.create({"id": 7, "name":  "user7"}),
        User.create({"id": 8, "name":  "user8"}),
        User.create({"id": 9, "name":  "user9"}),
        User.create({"id": 10, "name":  "user10"}),
        User.create({"id": 11, "name":  "user11"}),
        User.create({"id": 12, "name":  "user12"}),
        User.create({"id": 13, "name":  "user13"}),
        User.create({"id": 14, "name":  "user14"}),
        User.create({"id": 15, "name":  "user15"}),
    ]).then(()=>{
        console.log("Users created");
    })
})


const paginatedResults = (model)=>{
    return async(req,res,next)=>{
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page-1)*limit;
        const endIndex = page*limit;

        const results = {};
        if(endIndex < await model.countDocuments().exec() && endIndex){
            results.nextPage = {
                page: (page + 1),
                limit: limit
            }
        }
        if(startIndex > 0){
            results.previousPage = {
                page: (page - 1),
                limit: limit
            }
        }
        try{
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.pageResults = results
            next();
        }
        catch(e){
            res.status(500).json({message:e.message})
        }
    }
}

app.get('/users', paginatedResults(User),(req,res)=>{
    const pageResults = res.pageResults;
    res.status(200).send(pageResults);
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

