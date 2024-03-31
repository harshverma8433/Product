const { log } = require("console")
const express = require("express")
const app = express()
const hbs = require("hbs")
const path = require("path")
const {v4:uuidv4} = require("uuid")
const mongoose = require("mongoose");

app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))

app.set("view engine","hbs")
hbs.registerPartials(__dirname,"/views/partiala")


mongoose.connect("mongodb+srv://harshverma8433:8433199105@cluster0.rx8re1j.mongodb.net/productPage",{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("DATABASE CONNECTED");
}).catch((err)=>{
    console.log(err);
})

const schema = new mongoose.Schema({
    name:String,
    image:String,
    price:String,
    productId:String
})

// let products = []
const products = new mongoose.model("products",schema);


app.post("/addproduct",async (req,res)=>{
    const {name,image,price} = req.body;
    let object = {
        name,
        image,
        price,
        productId:uuidv4()
    }

    // products.push(object);
    await products.create(object);
    res.redirect("/getproduct");
})

app.get("/getproduct",async (req,res)=>{
    let product = await products.find();
    res.render("productPage",{
        product
    })
})

app.get("/delete/:productId",async (req,res)=>{
    // products = products.filter((item)=>
    //     item.productId != req.params.productId
    // )
    let pid = req.params.productId;
    await products.deleteOne({productId:pid})
    res.redirect("/getproduct")
})

app.get("/update/:productId",async (req,res)=>{
    // const updateproduct = products.filter((item)=>item.productId == req.params.productId);
    let pid = req.params.productId
    const updateproduct=await products.findOne({productId:pid})
    console.log(updateproduct[0]);
    res.render("updatePage",{
        // updateproduct:updateproduct[0]
        updateproduct:updateproduct
    })
})

app.post("/updateproduct",async (req,res)=>{
    const  {name,image,price,productId}=req.body;
    const obj = {
        name,
        image,
        price,
        productId
    }

    // products = products.map((item)=>{
    //     if(item.productId == productId){
    //         return obj;
    //     }
    //     return item
    // })

    await products.updateOne({ productId: productId }, { $set: obj })

    res.redirect("/getproduct")

})

app.listen(4000,()=>{
    console.log("http://localhost:"+4000);
})
