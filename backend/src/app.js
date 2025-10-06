import express from "express"
import { ENV } from "./config/env.js"
import { connectdb } from "./config/db.js";
import cors from "cors"
import { clerkMiddleware } from "@clerk/express"
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js"
import notificationRoute from "./routes/notification.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());
// app.use(arcjetMiddleware);

app.get("/", (req, res) => {
    res.send("Server is working");

});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoute);
app.use("/api/Notification", notificationRoute);

//error handling Middleware
app.use((err, req, res, next) => {
    console.error("Unchanged Error:", err);
    res.status(500).json({ error: err.message || "Internal server Error🚨" });
});

const startserver = async () => {
    try {
        await connectdb();

        if (ENV.NODE_ENV !== "production") {
            app.listen(ENV.PORT, () => {
                console.log("server is running in localhost: ${ENV.PORT}")
            })
        }

    } catch (error) {
        console.log("Failed to connect to the database", error.message);
        process.exit(1);
    }
}

startserver();

//export for vercel
export default app;