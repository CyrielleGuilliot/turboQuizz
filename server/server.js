const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const listsFilePath = path.join(__dirname, "data", "wordList.json");
const usersFilePath = path.join(__dirname, "data", "users.json");

const getUsers = () => JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
const getLists = () => JSON.parse(fs.readFileSync(listsFilePath, "utf8"));
const saveLists = (lists) =>
    fs.writeFileSync(listsFilePath, JSON.stringify(lists, null, 2));

// 🔐 Auth
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, userId: user.id });
    } else {
        res.status(401).json({ success: false, message: "Identifiants invalides" });
    }
});

// 📄 Récupérer les listes d'un utilisateur
app.get("/api/users/:userId/lists", (req, res) => {
    const userId = parseInt(req.params.userId);
    const lists = getLists();
    const userLists = lists.filter(list => list.userId === userId);
    res.json(userLists);
});

// ➕ Ajouter une liste à un utilisateur
app.post("/api/users/:userId/lists", (req, res) => {
    const userId = parseInt(req.params.userId);
    const newList = req.body;
    const lists = getLists();

    const newId = lists.length > 0 ? Math.max(...lists.map(l => l.id)) + 1 : 1;

    const listToAdd = {
        ...newList,
        id: newId,
        userId,
    };

    lists.push(listToAdd);
    saveLists(lists);

    res.status(201).json(listToAdd);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
