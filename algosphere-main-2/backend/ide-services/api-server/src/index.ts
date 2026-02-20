import express from "express";
import cors from "cors";
const fetch = global.fetch;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// ⬇️ UPDATE: correct Jupyter URL
const JUPYTER = "http://localhost:8888";

app.get("/", (req, res) => {
  res.send("API Server running 🧠");
});

app.post("/api/nb/execute", async (req, res) => {
  try {
    const { code } = req.body;

    // 1️⃣ Create a kernel
    const kernelRes = await fetch(`${JUPYTER}/api/kernels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const kernel = await kernelRes.json();

    // 2️⃣ Execute code
    const execRes = await fetch(`${JUPYTER}/api/kernels/${kernel.id}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const result = await execRes.json();

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error:String(err) });
  }
});

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
