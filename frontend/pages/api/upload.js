import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/models');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const form = formidable({ multiples: false, uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) return res.status(500).json({ error: 'Upload failed' });

    const zipPath = files.file.filepath;
    const slug = fields.slug || Date.now().toString();
    const extractPath = path.join(uploadDir, slug);
    fs.mkdirSync(extractPath, { recursive: true });

    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .on('close', () => {
        fs.unlinkSync(zipPath);
        res.status(200).json({ success: true, slug });
      })
      .on('error', (e) => {
        res.status(500).json({ error: 'Unzip failed', details: e.message });
      });
  });
}