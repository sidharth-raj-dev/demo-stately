import express from 'express';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/run/:script', (req, res) => {
    const scriptName = req.params.script;
    const scriptPath = path.join(__dirname, `${scriptName}.js`);

    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).send(error.message);
        }
        res.send(stdout);
    });
});

app.get('/code/:script', async (req, res) => {
    const scriptName = req.params.script;
    const scriptPath = path.join(__dirname, `${scriptName}.js`);

    try {
        const code = await fs.readFile(scriptPath, 'utf-8');
        res.send(code);
    } catch (error) {
        console.error(`Error reading script: ${error}`);
        res.status(404).send('Script not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});