const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

////check database for saved notes
const db = fs.readFileSync("./db/db.json", "utf-8");
const notes = fs.readFileSync("./public/notes.html", "utf-8");
const index = fs.readFileSync("./public/index.html", "utf-8");
// console.log(db);
const getAllNotes = (req, res) => {
  const notes = fs.readFileSync("./public/notes.html", "utf-8");
  res.status(200);
  res.send(notes, "utf-8", (req, res) => {
    console.log("test");
  });
};

const showIndex = (req, res) => {
  res.status(200);
  res.send(index, "utf-8", (req, res) => {
    console.log("test");
  });
};

app.post("/api/notes", (req, res) => {
  const dbString = req.body;
  // console.log(dbString);
  const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  dbString.id = (notes.length || 0) + 1;
  // console.log(notes, "     notes");
  notes.push(dbString);
  const strJson = JSON.stringify(notes);
  fs.writeFileSync("./db/db.json", strJson);
  res.send("ok received");
});

app.get("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  res.send(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  const editNote = notes[id - 1];
  console.log(editNote);
  res.send(editNote);
});
////////////////////////////////
app.post("/api/notes/:id", (req, res) => {
  // console.log(id);
  const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8")); // console.log(notes);
  res.send(`sample send`);
});

app.get("/api/notes/:id/delete", function (req, res) {
  const id = req.params.id;
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  notes.splice(id - 1, 1);
  // console.log(id);
  // console.log(notes);
  notes = JSON.stringify(notes);
  fs.writeFileSync("./db/db.json", notes);
  res.redirect("/notes").send(notes);
});

app.route(["/", "/index", "/index.html", "*"]).get(showIndex);
app.route(["/notes", "/notes.html"]).get(getAllNotes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is running"));
