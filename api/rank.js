export default async function handler(req, res) {
  const { username, tag, region, display } = req.query;

  if (!username || !tag || !region || !display) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  const targetUrl = `http://zabriddev.ddns.net/valorantapi/rank/${encodeURIComponent(
    username
  )}/${encodeURIComponent(tag)}/${encodeURIComponent(
    region
  )}/${encodeURIComponent(display)}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    res.status(200).json(data);
  } catch (error) {
    console.error("Error proxy:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
}
