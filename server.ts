import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI();

// Maps Grounding Endpoint using gemini-2.5-flash with googleMaps tool
app.post('/api/maps-grounding', async (req: Request, res: Response) => {
  try {
    const { branchCity, branchMall, branchAddress, userOrigin } = req.body;

    const prompt = `Sebagai asisten navigasi resmi Kevin 88 Computer, berikan informasi petunjuk arah, rute terbaik, patokan gedung/mall terdekat, dan jam operasional untuk mengunjungi cabang kami:
Cabang: Kevin 88 Computer ${branchCity || 'Semarang'}
Lokasi: ${branchMall || 'Pusat Komputer'}
Alamat Lengkap: ${branchAddress || 'Jawa Tengah'}
Titik Berangkat Pengunjung: ${userOrigin || 'Pusat Kota / Stasiun / Terminal terdekat'}

Gunakan Google Maps data terkini untuk memberikan:
1. Rekomendasi rute akses kendaraan (motor/mobil) dan patokan landmark yang mudah dikenali.
2. Estimasi kemudahan akses parkir dan pintu masuk toko terdekat.
3. Tips praktis bagi pengunjung yang ingin datang membawa laptop untuk servis atau pasang sparepart di tempat.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const text = response.text || candidate?.content?.parts?.[0]?.text || 'Petunjuk arah navigasi Google Maps tersedia.';
    const groundingMetadata = candidate?.groundingMetadata || null;

    res.json({
      success: true,
      text,
      groundingMetadata,
    });
  } catch (error: any) {
    console.warn('Maps Grounding API unavailable, returning curated navigation directions:', error?.message);
    const { branchCity, branchMall, branchAddress, userOrigin } = req.body || {};
    res.json({
      success: true,
      text: `Panduan Rute Menuju Kevin 88 Computer ${branchCity || 'Semarang'}:
1. Rute dari ${userOrigin || 'Pusat Kota / Stasiun'}: Arahkan kendaraan ke kawasan pusat perbelanjaan ${branchMall || 'Plasa Simpang Lima / Java Mall'}.
2. Patokan Akses: Berada di lantai pusat komputer & elektronik. Area parkir motor dan mobil tersedia luas di gedung mall.
3. Tips Servis & Pasang di Tempat: Bawa laptop dan adaptor charger bawaan Anda agar teknisi kami dapat melakukan pengecekan voltase dan tes pasang sparepart secara langsung di toko (tersedia konsultasi gratis).
Alamat: ${branchAddress || 'Jawa Tengah'}.`,
      groundingMetadata: null,
    });
  }
});

// Production vs Development handler
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.resolve(distPath, 'index.html'));
  const isProd = process.env.NODE_ENV === 'production' || hasDist;

  // Cloud Run Health Check Endpoint
  app.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn('Vite middleware could not be loaded, using static fallback:', viteErr);
      if (hasDist) {
        app.use(express.static(distPath));
        app.get('*', (_req: Request, res: Response) => {
          res.sendFile(path.resolve(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
