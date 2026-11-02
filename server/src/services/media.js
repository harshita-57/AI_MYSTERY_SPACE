import { v2 as cloudinary } from 'cloudinary';

const configured = () => Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

export async function generateEvidenceMedia(caseData, evidenceIds) {
  const providerUrl = process.env.IMAGE_PROVIDER_URL;
  if (!providerUrl) return caseData;
  const candidates = caseData.evidence.filter(item => ['photograph', 'cctv'].includes(item.category) && (!evidenceIds || evidenceIds.includes(item.id))).slice(0, 2);
  if (configured()) cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
  await Promise.all(candidates.map(async evidence => {
    try {
      const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 45000);
      let response;
      try {
        response = await fetch(providerUrl, {
          method: 'POST', signal: controller.signal,
          headers: { 'Content-Type': 'application/json', ...(process.env.IMAGE_PROVIDER_API_KEY ? { Authorization: `Bearer ${process.env.IMAGE_PROVIDER_API_KEY}` } : {}) },
          body: JSON.stringify({ prompt: `Create a fictional, realistic piece of detective evidence for a mystery game. Case environment: ${caseData.location}. Incident context: ${caseData.incidentReport}. Exhibit: ${evidence.title}. Visual description: ${evidence.description}. Make this a single still image, with no readable text, no real people, no gore, and no new facts that contradict the description. Cinematic archival evidence photograph.`, size: '1024x1024', response_format: 'url' })
        });
      } finally { clearTimeout(timeout); }
      if (!response.ok) throw new Error(`Image provider returned ${response.status}`);
      const payload = await response.json();
      let url = payload.url || payload.image_url || payload.data?.[0]?.url;
      const base64 = payload.b64_json || payload.data?.[0]?.b64_json;
      if (!url && base64) url = `data:image/png;base64,${base64}`;
      if (!url) throw new Error('Expected provider response with url or b64_json.');
      if (configured()) { const upload = await cloudinary.uploader.upload(url, { folder: `ai-mystery-space/${caseData.themeId}`, resource_type: 'image', overwrite: false }); url = upload.secure_url; evidence.mediaProvider = 'cloudinary'; }
      else evidence.mediaProvider = 'image-provider';
      evidence.mediaUrl = url; evidence.mediaGenerationStatus = 'ready';
    } catch (error) {
      evidence.mediaGenerationStatus = 'unavailable';
      console.warn(`Optional evidence media unavailable for ${evidence.id}: ${error.message}`);
    }
  }));
  return caseData;
}
