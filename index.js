import express from 'express';
import dotenv from 'dotenv';
import { connect } from './database.js';
import { User } from './models/user.js';

//create express server
const app = express();
app.use(express.json());


app.use((req, res, next) => {
    console.log("[Request]" + req.method + " " + req.path);
    next();
});

//LOad configuration
dotenv.config();
await connect();

// console.log(process.env.PORT);

//Add router/end points
app.get("/users", (req, res) => {
    res.json({ success: true });
});

app.post("/users", async (req, res) => {
    try {
       const user = await User.create(req.body);
       res.json(user); 
    } catch( error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }   
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete("/users", async (req, res) => {
    try {
        const report = await User.deleteMany({});
        console.log(report);
        res.json({ok: true})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch(error) {
        res.status(400).json({ error: error.message});
    }
})
app.patch("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body);
        res.json(user);
    } catch(error) {
        res.status(400).json({ error: error.message});
    }
})

app.delete("/users/:id", async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id, req.body);
        res.json(user);
    } catch(error) {
        error.status = true;
        next(error)
    }
})


app.use((req, res) => {
    res.status(404);
    res.json({ success: false, error: "Not found" });
})

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(404).json({ success: false, error: "Not found" });
    } else {
        res.status(500).json({ success: false, error: "Not found" });
    }
    
})



app.listen(process.env.PORT, () => {
    console.log("App started listening to request http://localhost:"+process.env.PORT)
});