import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));


app.get("/", (req, res) => {
    return res.send("<h1>Welcome to VistaView API</h1>")
});

export default app;