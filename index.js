const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const router = require("./routes/routes");
const cors = require("cors");

const port = process.env.PORT;
const hostName = process.env.HOSTNAME;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
})

app.use("/", router);

app.listen(port, hostName, () => {
    console.log(`Servidor rodando na porta ${port}.`);
})
