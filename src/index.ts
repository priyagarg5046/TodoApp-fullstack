//imports
import express from 'express';
import { addTodo, addUser, deletetodo, findUser, getTodos, updatetodo } from './functions';
import session from 'express-session';
// import path from 'path';

const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// app.use(express.static())
interface CustomSessionData {
    userId?: number; // Define userId property as optional
}

declare module 'express-session' {
    interface SessionData {
        user: CustomSessionData;
    }
}

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));


app.set('view engine', 'hbs');

app.get("/gettodos", async (req, res) => {
    try {
        const userId = req.session.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" }); // Or handle unauthorized access accordingly
        }

        // Fetch the updated list of todos for the user
        const todos = await getTodos(userId);

        // Render the todos view with the updated todos
        res.render("todos.hbs", { todos });
       
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

app.post("/addtodos", async (req, res) => {
    try {
        const { taskname} = req.body;
        const userId = req.session.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" }); // Or handle unauthorized access accordingly
        }
        // Add todo to the database
        await addTodo(taskname, userId);
        res.redirect("/gettodos");
    } catch (error) {
        console.error("Error adding todo:", error);
        res.status(500).json({ error: "Failed to add todo" });
    }
});

app.get("/deletetodo/:id", async (req, res) => {
    try {
        const todoId = Number(req.params.id);

        await deletetodo(todoId);
        res.redirect("/gettodos");
       
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ error: "Failed to delete todo" });
    }
});

app.post("/updatetodo", (req, res) => {
    const { todoid, taskname } = req.body;
    console.log(todoid);
    if (!taskname) {
        res.status(400).send('Task name is required.');
        return;
    }
    updatetodo(Number(todoid), taskname);
    res.status(200).send('Todo updated successfully.');
});
app.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Perform input validation
        if (!username || !password || !email) {
            return res.status(400).json({ error: "Username, password, and email are required." });
        }

        // Add user to the database
        await addUser(username, password, email);

        // Redirect to login page after successful registration
        res.redirect("/login");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Failed to register user." });
    }
});
app.get("/register",(req,res)=>{

    res.render("register")
})
app.get("/login",async(req,res)=>{
  
   res.render("login.hbs");
    
})
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await findUser(username, password);

        if (!user) {
            return res.render("login.hbs", { error: "Invalid username or password." });
        }
        
        
        req.session.user={
            userId:user.id,

        }
      
        res.redirect("/gettodos");
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Failed to log in." });
    }
});

app.listen(4444,()=>{
    console.log("server started at 4444");
})