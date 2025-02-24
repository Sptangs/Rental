const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const migration = require("./migration/migration");
const router = require("./routes/routes");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);

migration();
app.use(express.json());

app.listen(port, () => {
    console.log(`jalan di port ${port}`);
});