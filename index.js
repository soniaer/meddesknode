const express = require("express");
const app = express();
const cors = require("cors"); 
const sql = require('mssql');
app.use(cors());
app.use(express.json());
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
// Insert into meddeskainfc(IdCard_Number, Patient_Name, First_Name, Last_Name,
//   Date_Of_Birth, Patient_Id, Age, Height, Weight, Address, Phone_Number,
//    Primary_Physician, Date_Of_Visit, Additional_Data, DateTime)
//     Values('123','123','123','123','123','123','123','123','123','123','123','123','123','123','123')

console.log("Starting...");
app.get("/", async(req, res) => {
res.send({message:"testing"})

})
app.get("/api/getdata", async(req, res) => {
   
//connectAndQuery();
try {
    var poolConnection = await sql.connect(config);

    console.log("Reading rows from the Table...");
    var resultSet = await poolConnection.request().query(`SELECT * from meddeskainfc`);//meddeskainfc meddeskaiqr

    console.log(`${resultSet.recordset.length} rows returned.`);

    // output column headers
    var columns = "";
    for (var column in resultSet.recordset.columns) {
        columns += column + ", ";
    }
    console.log("%s\t", columns.substring(0, columns.length - 2));

    // ouput row contents from default record set
    resultSet.recordset.forEach(row => {
       // console.log("%s\t%s", row);
    });

    // close connection only when we're certain application is finished
    poolConnection.close();
    res.send(resultSet.recordset)

} catch (err) {
    console.error(err.message);
    res.send({message:err.message})
}
})


app.post("/api/addpatient", async(req, res) => {
   const {IdCard_Number,Patient_Name,First_Name,Last_Name,Date_Of_Birth,Patient_Id,Age,Height,Weight,Address,Phone_Number,
    Primary_Physician,Date_Of_Visit,Additional_Data,DateTime} =req?.body
    //connectAndQuery();
    try {
        var poolConnection = await sql.connect(config);
    
        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(
            `Insert into meddeskainfc(IdCard_Number, Patient_Name, First_Name, Last_Name,
           Date_Of_Birth, Patient_Id, Age, Height, Weight, Address, Phone_Number,
Primary_Physician, Date_Of_Visit, Additional_Data, DateTime)
             Values('${IdCard_Number}','${Patient_Name}','${First_Name}','${Last_Name}','${Date_Of_Birth}','${Patient_Id}',
                '${Age}','${Height}',
                '${Weight}','${Address}','${Phone_Number}','${Primary_Physician}','${Date_Of_Visit}','${Additional_Data}',
                '${DateTime}')`);//meddeskainfc meddeskaiqr
    
        console.log(`${resultSet} rows returned.`);

    
        // close connection only when we're certain application is finished
        poolConnection.close();
        res.send(resultSet)
    
    } catch (err) {
        console.error(err.message);
        res.send({message:err.message})
    }
    })


    app.post("/api/addproduct", async(req, res) => {
        const {Title,Description,Weight,Manufacture,Barcode_Number,Data_Sheet,Product_Image,DateTime} =req?.body
         //connectAndQuery();
         try {
             var poolConnection = await sql.connect(config);
         
             console.log("Reading rows from the Table...");
             var resultSet = await poolConnection.request().query(
                 `Insert into meddeskaiqr(Title, Description, Weight, Manufacture,
                    Barcode_Number, Data_Sheet, Product_Image, DateTime)
                  Values('${Title}','${Description}','${Weight}','${Manufacture}','${Barcode_Number}','${Data_Sheet}',
                     '${Product_Image}','${DateTime}')`);//meddeskainfc meddeskaiqr
         
             console.log(`${resultSet} rows returned.`);
     
         
             // close connection only when we're certain application is finished
             poolConnection.close();
             res.send(resultSet)
         
         } catch (err) {
             console.error(err.message);
             res.send({message:err.message})
         }
         })

         app.get("/api/getproducts", async(req, res) => {
            try {
                var poolConnection = await sql.connect(config);
            
                console.log("Reading rows from the Table...");
                var resultSet = await poolConnection.request().query(`SELECT * from meddeskaiqr`);//meddeskainfc meddeskaiqr
            
                console.log(`${resultSet.recordset.length} rows returned.`);
            
                // output column headers
                var columns = "";
                for (var column in resultSet.recordset.columns) {
                    columns += column + ", ";
                }
                console.log("%s\t", columns.substring(0, columns.length - 2));
            
                // ouput row contents from default record set
                resultSet.recordset.forEach(row => {
                   // console.log("%s\t%s", row);
                });
            
                // close connection only when we're certain application is finished
                poolConnection.close();
                res.send(resultSet.recordset)
            
            } catch (err) {
                console.error(err.message);
                res.send({message:err.message})
            }
            })
            

async function connectAndQuery() {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(`SELECT * from meddeskainfc`);//meddeskainfc meddeskaiqr

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set
        resultSet.recordset.forEach(row => {
            console.log("%s\t%s", row);
        });

        // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}
