const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
app.use(cors());
app.use(express.json({ limit: "500mb" }));

const port = 3000;

// ✅ Optimized MSSQL Configuration with Connection Pool
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

// ✅ Create a Persistent Connection Pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("❌ Database Connection Failed: ", err);
    process.exit(1);
  });

// ✅ Start Server
const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));

// ✅ Simple Test Route
app.get("/", (req, res) => {
  res.send({ message: "API is running!" });
});

// ✅ Get All Patients (Optimized Query)
app.get("/api/getdata", async (req, res) => {
  try {
    const pool = await poolPromise;
    const resultSet = await pool.request().query("SELECT * FROM meddeskainfc ORDER BY DateTime DESC");
    console.log(`${resultSet.recordset.length} rows returned.`);
    res.send(resultSet.recordset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
});

// ✅ Add a Patient (Optimized with Parameterized Query to prevent SQL Injection)
app.post("/api/addpatient", async (req, res) => {
    const {IdCard_Number,Patient_Name,First_Name,Last_Name,Date_Of_Birth,Patient_Id,Age,Height,Weight,Address,Phone_Number,
        Primary_Physician,Date_Of_Visit,Additional_Data,DateTime,Image} =req?.body
          try {
    const pool = await poolPromise;
    await pool.request()
    .query(
        `Insert into meddeskainfc(IdCard_Number, Patient_Name, First_Name, Last_Name,
        Date_Of_Birth, Patient_Id, Age, Height, Weight, Address, Phone_Number,
        Primary_Physician, Date_Of_Visit, Additional_Data, DateTime, Image)
        Values('${IdCard_Number}','${Patient_Name}','${First_Name}','${Last_Name}','${Date_Of_Birth}','${Patient_Id}',
        '${Age}','${Height}',
        '${Weight}','${Address}','${Phone_Number}','${Primary_Physician}','${Date_Of_Visit}','${Additional_Data}',
        '${DateTime}','${Image}')`);
    res.send({ message: "Patient added successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
});


app.post("/api/addproduct", async(req, res) => {
    const {Title,Description,Weight,Manufacture,Barcode_Number,Data_Sheet,Product_Image,DateTime} =req?.body
    try {
        const pool = await poolPromise;
        await pool.request().query(
    `Insert into meddeskaiqr(Title, Description, Weight, Manufacture,
    Barcode_Number, Data_Sheet, Product_Image, DateTime)
    Values('${Title}','${Description}','${Weight}','${Manufacture}','${Barcode_Number}','${Data_Sheet}',
    '${Product_Image}','${DateTime}')`);//meddeskainfc meddeskaiqr
    res.send({ message: "Product added successfully!" });

    } catch (err) {
    console.error(err.message);
    res.send({message:err.message})
    }
    })


    app.get("/api/getproducts", async(req, res) => {
        try {
            const pool = await poolPromise;
            const resultSet = await pool.request().request().query(`SELECT * from meddeskaiqr`);//meddeskainfc meddeskaiqr
        console.log(`${resultSet.recordset.length} rows returned.`);
        poolConnection.close();
        res.send(resultSet.recordset)
        } catch (err) {
        console.error(err.message);
        res.send({message:err.message})
        }
        })


// ✅ Delete a Patient (Optimized with Parameterized Query)
app.post("/api/deletepatient", async (req, res) => {
  const { id } = req.body;
  try {
    const pool = await poolPromise;
    await pool.equest().query(`Delete from meddeskainfc where id='${id}'`);//meddeskainfc meddeskaiqr
    res.send({ message: "Patient deleted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
});

// ✅ Delete a Product (Optimized with Parameterized Query)
app.post("/api/deleteproduct", async (req, res) => {
  const { id } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request().query(`Delete from meddeskaiqr where id='${id}'`);//meddeskainfc meddeskaiqr
    res.send({ message: "Product deleted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
});



// ✅ Get Scanned Product Data (Optimized)
app.post("/api/getscannedproducts", async (req, res) => {
  const { Barcode_Number } = req.body;
  try {
    const pool = await poolPromise;
    const resultSet = await pool.request()
    .query(`SELECT * from meddeskaiqr where Barcode_Number='${Barcode_Number}'`);//meddeskainfc meddeskaiqr

    res.send(resultSet.recordset.length ? resultSet.recordset[0] : { message: "No Data" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
});

// ✅ Get Scanned Patient Data (Optimized)
app.post("/api/getscanneddata", async (req, res) => {
  const { Patient_Id } = req.body;
  try {
    const pool = await poolPromise;
    const resultSet = await pool.request()
    .query(`SELECT * from meddeskainfc where Patient_Id='${Patient_Id}'`);// meddeskaiqr

    res.send(resultSet.recordset.length ? resultSet.recordset[0] : { message: "No Data" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
});


app.post("/api/getqrcode", async(req, res) => {
    const {Barcode} = req.body;
    try {
        const pool = await poolPromise;
        const resultSet = await pool.request().query(`SELECT Barcode_Number from meddeskaiqr`);// meddeskaiqr
    if(resultSet.recordset.length == 0){
    res.send({message:"No Data"})
    }else{
    res.send({Barcode:resultSet?.recordset[resultSet?.recordset?.length-1]?.Barcode_Number?.slice(-2)})
    }
    } catch (err) {
    console.error(err.message);
    res.send({message:err.message})
    }
    })

app.get("/api/getscannedcode", async (req, res) => {
    try {
      const pool = await poolPromise;
      const resultSet = await pool.request().query(`
      SELECT 
    CASE 
        WHEN (SELECT MAX(DateTime) FROM meddeskaiqr) > (SELECT MAX(DateTime) FROM meddeskainfc) 
        THEN (SELECT Barcode_Number FROM meddeskaiqr WHERE DateTime = (SELECT MAX(DateTime) FROM meddeskaiqr)) 
        ELSE (SELECT Patient_Id FROM meddeskainfc WHERE DateTime = (SELECT MAX(DateTime) FROM meddeskainfc)) 
    END AS code
    `);
  
      if (resultSet.recordset.length === 0) {
        res.send({ message: "No Data" });
      } else {
        res.send(resultSet.recordset[0]);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: err.message });
    }
  });
