var express = require("express");
var cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.urlencoded());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//Khi một web client tải một tệp lên máy chủ, nó thường được gửi qua một biểu mẫu và được mã hóa dưới dạng dữ liệu multipart/form-data.
// Multer là một middleware cho Express và Nodejs giúp dễ dàng xử lý dữ liệu multipart/form-data khi người dùng upload file.
//storage: định nghĩa một đối tượng để lưu trữ file upload.
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); //tao 1 folder uploads o public de chua file
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "" + Date.now());
  },
});
let upload = multer({ storage: storage });
app.post(
  "/api/fileanalyse",
  upload.single("upfile"), //giong voi name input form o client
  (req, res) => {
    const file = req.file;
    const size = file.size;
    const name = file.originalname;
    const type = file.mimetype;
    console.log(file);
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    res.json({ name: name, type: type, size: size });
  }
);

// name: "untitled.mtl",
// type: "application/octet-stream",
// size: 865

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
