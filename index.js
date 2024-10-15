const express = require("express");
const app = express();
const cors = require("cors"); 
const sql = require('mssql');
app.use(cors());
app.use(express.json({limit: '500mb'}));
const port = process.env.PORT || 3004;
const server = app.listen(port, () =>
console.log(`mqttengine app listening on port ${port}!`)
);

const config = {
user: 'meddeskaiqrnfcserver', // better stored in an app setting such as process.env.DB_USER
password: 'Meddeskai#', // better stored in an app setting such as process.env.DB_PASSWORD
server: 'meddeskaiqrnfcserver.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
database: 'meddeskaiqrnfc', // better stored in an app setting such as process.env.DB_NAME
authentication: {
type: 'default'
},
options: {
encrypt: true
}
}

console.log("Starting...");
app.get("/", async(req, res) => {
res.send({message:"testing"})
})

app.get("/api/getdata", async(req, res) => {
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(`SELECT * from meddeskainfc`);//meddeskainfc meddeskaiqr
console.log(`${resultSet.recordset.length} rows returned.`);
poolConnection.close();
res.send(resultSet.recordset)
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.post("/api/addpatient", async(req, res) => {
const {IdCard_Number,Patient_Name,First_Name,Last_Name,Date_Of_Birth,Patient_Id,Age,Height,Weight,Address,Phone_Number,
Primary_Physician,Date_Of_Visit,Additional_Data,DateTime,Image} =req?.body
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(
`Insert into meddeskainfc(IdCard_Number, Patient_Name, First_Name, Last_Name,
Date_Of_Birth, Patient_Id, Age, Height, Weight, Address, Phone_Number,
Primary_Physician, Date_Of_Visit, Additional_Data, DateTime, Image)
Values('${IdCard_Number}','${Patient_Name}','${First_Name}','${Last_Name}','${Date_Of_Birth}','${Patient_Id}',
'${Age}','${Height}',
'${Weight}','${Address}','${Phone_Number}','${Primary_Physician}','${Date_Of_Visit}','${Additional_Data}',
'${DateTime}','${Image}')`);//meddeskainfc meddeskaiqr
console.log(`${resultSet} rows returned.`);
poolConnection.close();
res.send(resultSet)
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.post("/api/addproduct", async(req, res) => {
const {Title,Description,Weight,Manufacture,Barcode_Number,Data_Sheet,Product_Image,DateTime} =req?.body
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(
`Insert into meddeskaiqr(Title, Description, Weight, Manufacture,
Barcode_Number, Data_Sheet, Product_Image, DateTime)
Values('${Title}','${Description}','${Weight}','${Manufacture}','${Barcode_Number}','${Data_Sheet}',
'${Product_Image}','${DateTime}')`);//meddeskainfc meddeskaiqr
console.log(`${resultSet} rows returned.`);
poolConnection.close();
res.send(resultSet)
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.get("/api/getproducts", async(req, res) => {
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(`SELECT * from meddeskaiqr`);//meddeskainfc meddeskaiqr
console.log(`${resultSet.recordset.length} rows returned.`);
poolConnection.close();
res.send(resultSet.recordset)
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.post("/api/deletepatient", async(req, res) => {
const {id} = req.body
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(`Delete from meddeskainfc where id='${id}'`);//meddeskainfc meddeskaiqr
console.log(`${resultSet.recordset.length} rows returned.`);
poolConnection.close();
res.send(resultSet.recordset)
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.post("/api/deleteproduct", async(req, res) => {
const {id} = req.body
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(`Delete from meddeskaiqr where id='${id}'`);//meddeskainfc meddeskaiqr
poolConnection.close();
res.send(resultSet.recordset)
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.post("/api/getscannedproducts", async(req, res) => {
const {Barcode_Number} = req.body;
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(`SELECT * from meddeskaiqr where Barcode_Number='${Barcode_Number}'`);//meddeskainfc meddeskaiqr
console.log(`${resultSet.recordset.length} rows returned.`)
resultSet.recordset.forEach(row => {
});
poolConnection.close();
if(resultSet.recordset.length == 0){
res.send({message:"No Data"})
}else{
res.send(resultSet?.recordset[resultSet?.recordset?.length-1])
}
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.post("/api/getscanneddata", async(req, res) => {
const {Patient_Id} = req.body;
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(`SELECT * from meddeskainfc where Patient_Id='${Patient_Id}'`);// meddeskaiqr
console.log(`${resultSet.recordset.length} rows returned.`)
resultSet.recordset.forEach(row => {
});
poolConnection.close();
if(resultSet.recordset.length == 0){
res.send({message:"No Data"})
}else{
res.send(resultSet?.recordset[resultSet?.recordset?.length-1])
}
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.post("/api/getqrcode", async(req, res) => {
const {Barcode} = req.body;
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(`SELECT RIGHT(Barcode_Number,2) from meddeskaiqr where Barcode_Number='${Barcode}'`);// meddeskaiqr
console.log(`${resultSet.recordset.length} rows returned.`)
resultSet.recordset.forEach(row => {
});
poolConnection.close();
if(resultSet.recordset.length == 0){
res.send({message:"No Data"})
}else{
res.send(resultSet?.recordset[resultSet?.recordset?.length-1])
}
} catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})

app.post("/api/getnfccode", async(req, res) => {
const {Patient_Id} = req.body;
try {
var poolConnection = sql.connect(config);
var resultSet = await poolConnection.request().query(`SELECT RIGHT(Patient_Id,2) from meddeskainfc where Patient_Id='${Patient_Id}'`);// meddeskaiqr
console.log(`${resultSet.recordset.length} rows returned.`)
resultSet.recordset.forEach(row => {
});
poolConnection.close();
if(resultSet.recordset.length == 0){
res.send({message:"No Data"})
}else{
res.send(resultSet?.recordset[resultSet?.recordset?.length-1])
}
} 
catch (err) {
console.error(err.message);
res.send({message:err.message})
}
})
