import "dotenv/config";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { google } from "googleapis";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dbFile = path.join(dataDir, "scoutify.json");
const app = express();
const upload = multer({ dest: path.join(__dirname, "uploads"), limits: { fileSize: 1024 * 1024 * 1024 } });
const port = Number(process.env.PORT || 3000);
const jwtSecret = process.env.JWT_SECRET || "development-only-change-me";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

async function readDb() {
  try {
    return JSON.parse(await fs.readFile(dbFile, "utf8"));
  } catch {
    return { users: [], messages: [], videos: [] };
  }
}

async function writeDb(db) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
}

function tokenFor(user) {
  return jwt.sign({ sub: user.id, email: user.email, name: user.name }, jwtSecret, { expiresIn: "7d" });
}

function auth(req, res, next) {
  const value = req.headers.authorization || "";
  const token = value.startsWith("Bearer ") ? value.slice(7) : "";
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: "Please sign in to continue." });
  }
}

function googleClient() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return null;
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `http://localhost:${port}/api/auth/google/callback`
  );
}

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "scoutify-api" }));

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    return res.status(400).json({ error: "Name, email, and a password of at least 8 characters are required." });
  }
  const db = await readDb();
  const normalizedEmail = email.trim().toLowerCase();
  if (db.users.some((user) => user.email === normalizedEmail)) return res.status(409).json({ error: "An account with that email already exists." });
  const user = { id: randomUUID(), name: name.trim(), email: normalizedEmail, role: role === "scout" ? "scout" : "player", passwordHash: await bcrypt.hash(password, 12), provider: "local", createdAt: new Date().toISOString() };
  db.users.push(user);
  await writeDb(db);
  res.status(201).json({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.post("/api/auth/login", async (req, res) => {
  const db = await readDb();
  const user = db.users.find((candidate) => candidate.email === req.body.email?.trim().toLowerCase());
  if (!user || !user.passwordHash || !(await bcrypt.compare(req.body.password || "", user.passwordHash))) return res.status(401).json({ error: "Email or password is incorrect." });
  res.json({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email, role: user.role || "player" } });
});

app.get("/api/auth/google", (_req, res) => {
  const client = googleClient();
  if (!client) return res.status(503).json({ error: "Google sign-in is not configured yet." });
  res.redirect(client.generateAuthUrl({ access_type: "offline", scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/youtube.upload"], prompt: "consent" }));
});

app.get("/api/auth/google/callback", async (req, res) => {
  const client = googleClient();
  if (!client || !req.query.code) return res.redirect("/?authError=Google%20sign-in%20is%20not%20configured");
  try {
    const { tokens } = await client.getToken(req.query.code);
    client.setCredentials(tokens);
    const { data } = await google.oauth2({ version: "v2", auth: client }).userinfo.get();
    const db = await readDb();
    let user = db.users.find((candidate) => candidate.googleId === data.id || candidate.email === data.email);
    if (!user) {
      user = { id: randomUUID(), name: data.name || data.email, email: data.email, googleId: data.id, provider: "google", googleTokens: tokens, createdAt: new Date().toISOString() };
      db.users.push(user);
    } else {
      user.googleId = data.id;
      user.googleTokens = tokens;
    }
    await writeDb(db);
    res.redirect(`/?token=${encodeURIComponent(tokenFor(user))}`);
  } catch {
    res.redirect("/?authError=Google%20sign-in%20failed");
  }
});

app.get("/api/messages", auth, async (req, res) => {
  const db = await readDb();
  res.json(db.messages.filter((message) => message.from === req.user.sub || message.to === req.user.sub));
});

app.post("/api/messages", auth, async (req, res) => {
  const { to, text } = req.body;
  if (!to?.trim() || !text?.trim()) return res.status(400).json({ error: "Recipient and message are required." });
  const db = await readDb();
  const message = { id: randomUUID(), from: req.user.sub, to: to.trim(), text: text.trim(), createdAt: new Date().toISOString() };
  db.messages.push(message);
  await writeDb(db);
  res.status(201).json(message);
});

app.post("/api/videos/youtube", auth, upload.single("video"), async (req, res) => {
  const db = await readDb();
  const user = db.users.find((candidate) => candidate.id === req.user.sub);
  const client = googleClient();
  if (!client || !user?.googleTokens) return res.status(400).json({ error: "Connect Google first to upload to YouTube." });
  if (!req.file) return res.status(400).json({ error: "Choose a video file to upload." });
  try {
    client.setCredentials(user.googleTokens);
    const youtube = google.youtube({ version: "v3", auth: client });
    const result = await youtube.videos.insert({ part: ["snippet", "status"], requestBody: { snippet: { title: req.body.title || "Scoutify upload", description: req.body.description || "Uploaded from Scoutify" }, status: { privacyStatus: req.body.privacyStatus || "private" } }, media: { body: (await import("node:fs")).createReadStream(req.file.path) } });
    const video = { id: randomUUID(), youtubeId: result.data.id, title: req.body.title || "Scoutify upload", owner: user.id, createdAt: new Date().toISOString() };
    db.videos.push(video);
    await writeDb(db);
    res.status(201).json({ video, url: `https://www.youtube.com/watch?v=${result.data.id}` });
  } catch (error) {
    res.status(502).json({ error: error.message || "YouTube upload failed." });
  } finally {
    await fs.rm(req.file.path, { force: true });
  }
});

app.listen(port, () => console.log(`Scoutify running at http://localhost:${port}`));