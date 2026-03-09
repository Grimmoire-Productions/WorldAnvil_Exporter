import express from "express";
import worldAnvilAPI from "../services/worldAnvilAPI.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { userToken, appKey } = req.body;

    if (!userToken) {
      return res.status(400).json({ error: "User token is required" });
    }

    // Use backend app key if available, otherwise use provided key
    const backendAppKey = process.env.WA_API_KEY || appKey;

    if (!backendAppKey) {
      return res.status(400).json({ error: "Application key is required" });
    }

    // Authenticate with World Anvil
    const user = await worldAnvilAPI.logIn(userToken, backendAppKey);

    // Store credentials in session
    req.session.userToken = userToken;
    if (!process.env.WA_API_KEY && appKey) {
      req.session.appKey = appKey;
    }
    req.session.userId = user.id;

    res.json({
      user,
      sessionId: req.sessionID,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// GET /api/auth/session
router.get("/session", (req, res) => {
  if (req.session.userToken && req.session.userId) {
    res.json({
      authenticated: true,
      userId: req.session.userId,
    });
  } else {
    res.json({ authenticated: false });
  }
});

// GET /api/auth/env
router.get("/env", (_req, res) => {
  const backendAppKey = process.env.WA_API_KEY;

  if (!backendAppKey) {
    res.json({ hasAppKey: false });
  } else {
    res.json({ hasAppKey: true });
  }
});
export default router;
