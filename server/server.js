import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins (customize if needed)
app.use(express.json({ limit: '10mb' })); // Increase limit if sending large images

app.post('/api/virtual-tryon', async (req, res) => {
    try {
        const azureUrl = process.env.AZURE_TRYON_URL;
        const azureKey = process.env.AZURE_TRYON_API_KEY;

        if (!azureUrl || !azureKey) {
            return res.status(500).json({ error: 'Azure ML URL or API key not set' });
        }

        const azureRes = await fetch(azureUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${azureKey}`
            },
            body: JSON.stringify(req.body)
        });

        const text = await azureRes.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { error: text };
        }

        // Log everything for debugging!
        console.log("Azure ML response status:", azureRes.status);
        console.log("Azure ML response body:", data);

        res.status(azureRes.status).json(data);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});