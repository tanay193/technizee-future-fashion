// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Optional: deployment name to route explicitly (if you need it)
// set AZURE_DEPLOYMENT_NAME in your .env or leave empty to let traffic routing decide
const AZURE_DEPLOYMENT_NAME = process.env.AZURE_DEPLOYMENT_NAME || "";

// Helper: sanitize base64 input (remove data URI, whitespace, and fix padding)
function sanitizeBase64(b64) {
    if (!b64 || typeof b64 !== "string") return b64;

    // Remove data URI prefix
    const commaIdx = b64.indexOf(",");
    if (b64.startsWith("data:") && commaIdx !== -1) {
        b64 = b64.slice(commaIdx + 1);
    }

    // Remove whitespace/newlines
    b64 = b64.replace(/\s+/g, "");

    // Fix padding length to multiple of 4
    const mod = b64.length % 4;
    if (mod === 1) {
        // suspicious length — trim one char if present
        b64 = b64.slice(0, -1);
    } else if (mod === 2) {
        b64 += "==";
    } else if (mod === 3) {
        b64 += "=";
    }
    return b64;
}

// Debug helper to log a brief preview of base64 safely
function briefB64Info(b64) {
    if (!b64) return { len: 0, start: null, end: null };
    return {
        len: b64.length,
        start: b64.slice(0, 30),
        end: b64.slice(-30),
    };
}

// Generic proxy helper
async function forwardToAzure(reqBody) {
    const azureUrl = process.env.AZURE_TRYON_URL;
    const azureKey = process.env.AZURE_TRYON_API_KEY;

    if (!azureUrl || !azureKey) {
        throw new Error("Azure ML URL or API key not set in server .env");
    }

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${azureKey}`,
    };

    if (AZURE_DEPLOYMENT_NAME) {
        headers["azureml-deployment"] = AZURE_DEPLOYMENT_NAME;
    }

    const resp = await fetch(azureUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(reqBody),
        // keep default timeout behavior; if needed adjust at deployment
    });

    const text = await resp.text();

    let parsed;
    try {
        parsed = JSON.parse(text);
        // If the service returned a JSON-encoded string, parse it again
        if (typeof parsed === "string") {
            try { parsed = JSON.parse(parsed); } catch { /* leave as string */ }
        }
    } catch {
        parsed = { error: text };
    }

    return { status: resp.status, body: parsed };

}

// AI Photoshoot endpoint
app.post("/api/ai-photoshoot", async (req, res) => {
    try {
        const payload = JSON.parse(JSON.stringify(req.body)); // shallow clone

        // sanitize any incoming base64 fields commonly used
        if (payload.garment_image) {
            payload.garment_image = sanitizeBase64(payload.garment_image);
            const info = briefB64Info(payload.garment_image);
            console.log("[ai_photoshoot] garment_image length:", info.len);
            console.log("[ai_photoshoot] garment_image start:", info.start);
            console.log("[ai_photoshoot] garment_image end:", info.end);
        }

        // add more sanitization if your frontend uses a different key name (model_image etc.)
        if (payload.model_image) {
            payload.model_image = sanitizeBase64(payload.model_image);
        }

        const result = await forwardToAzure(payload);
        console.log("[ai_photoshoot] Azure ML response status:", result.status);
        console.log("[ai_photoshoot] Azure ML response body:", result.body);

        return res.status(result.status).json(result.body);
    } catch (err) {
        console.error("[ai_photoshoot] Proxy error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Virtual Try-On endpoint
app.post("/api/virtual-tryon", async (req, res) => {
    try {
        const payload = JSON.parse(JSON.stringify(req.body));

        if (payload.garment_image) {
            payload.garment_image = sanitizeBase64(payload.garment_image);
            const info = briefB64Info(payload.garment_image);
            console.log("[virtual_tryon] garment_image length:", info.len);
            console.log("[virtual_tryon] garment_image start:", info.start);
            console.log("[virtual_tryon] garment_image end:", info.end);
        }
        if (payload.user_image || payload.person_image) {
            const key = payload.user_image ? "user_image" : "person_image";
            payload[key] = sanitizeBase64(payload[key]);
            const info2 = briefB64Info(payload[key]);
            console.log(`[virtual_tryon] ${key} length:`, info2.len);
            console.log(`[virtual_tryon] ${key} start:`, info2.start);
            console.log(`[virtual_tryon] ${key} end:`, info2.end);
        }

        const result = await forwardToAzure(payload);
        console.log("[virtual_tryon] Azure ML response status:", result.status);
        console.log("[virtual_tryon] Azure ML response body:", result.body);

        return res.status(result.status).json(result.body);
    } catch (err) {
        console.error("[virtual_tryon] Proxy error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
