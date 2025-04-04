import { NextApiRequest, NextApiResponse } from "next";
import { handler } from "../../src/api/process-daily-tips";

export default async function processDaily(req: NextApiRequest, res: NextApiResponse) {
  // Convert Next.js request/response to Express-style for compatibility
  return handler(req as any, res as any);
}