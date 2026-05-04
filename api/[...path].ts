import { app, startServer } from '../server';

// Init DB only once per cold start
let isInit = false;
export default async function handler(req: any, res: any) {
  try {
    if (!isInit) {
      await startServer(false); // Do not attach listen port on Vercel
      isInit = true;
    }
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel API error:", error);
    res.status(500).json({ error: "A server error has occurred internally.", details: error.message });
  }
}


