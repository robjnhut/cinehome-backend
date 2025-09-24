const express = require("express")
const app = express();

//render sets prot. default local to 3000
const PORT = process.env.PORT || 3000;

app.get("/",(req, res) => {
    res.send("Hello world from Render");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

});
