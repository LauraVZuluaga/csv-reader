import express from "express";
import cors from "cors";
import multer from "multer";
import csvToJson from "convert-csv-to-json";

const app = express();
const port = process.env.PORT ?? 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

//This data type is assigned, since it is not known which data type will be loaded in the template.
let userData: Array<Record<string, string>> = [];

app.use(cors());

app.post("/api/files", upload.single("file"), async (req, res) => {
  //1. Extract file from request
  const { file } = req;
  //2. Validate that we have file
  if (!file) {
    return res.status(500).json({ message: "El archivo es requerido" });
  }
  //3. Validate the mimetype(csv)
  if (file.mimetype != "text/csv") {
    return res.status(500).json({ message: "El archivo debe ser un CSV" });
  }

  let json: Array<Record<string, string>> = [];

  try {
    //4. Transform the file (Buffer) to string
    const rawCsv = Buffer.from(file.buffer).toString("utf-8");
    console.log(rawCsv);
    //5. Transform string CSV to JSON
    json = csvToJson.fieldDelimiter(",").csvStringToJson(rawCsv);
  } catch (error) {
    return res.status(500).json({ message: "Error procesando el archivo" });
  }

  //6. Save the JSON to db
  userData = json;

  //7.Return 200 with the message and the JSON info

  return res
    .status(200)
    .json({ data: json, message: "El archivo se cargó correctamente" });
});

app.get("/api/users", async (req, res) => {
  //1. Extract the query 'q' from the request
  const { q } = req.query;

  //2. Validate taht we have the query param
  if (!q) {
    return res.status(500).json({
      message: "El parámetro q es requerido",
    });
  }

  if (Array.isArray(q)) {
    return res.status(500).json({
      message: "El parámetro q debe ser un string",
    });
  }

  //3. Filter the data from the db (or memory) with the query param
  const search = q.toString().toLowerCase();

  const filteredData = userData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toLocaleLowerCase().includes(search)
    );
  });
  //4. Return 200 with the filtered data
  return res.status(200).json({ data: filteredData });
});

app.listen(port, () => {
  console.log("Holi");
});
