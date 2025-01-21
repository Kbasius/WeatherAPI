import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router, Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html

router.get('/', (_req: Request, res: Response) => {
    try {
        const indexPath = path.join(__dirname, '../../client/index.html');
        res.sendFile(indexPath);
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('An error occurred while loading the page.');
    }
});

export default router;
