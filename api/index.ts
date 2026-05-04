import { app, startServer } from '../server';

// Init DB only once per cold start
let isInit = false;
export default async function handler(req: any, res: any) {
  if (!isInit) {
    await startServer(); // Note: inside startServer we skip listening if VERCEL is true
    isInit = true;
  }
  return app(req, res);
}
