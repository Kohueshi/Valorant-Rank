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

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      const text = await response.text();
      return res
        .status(response.status)
        .json({ error: "Error en la API original", body: text });
    }

    if (contentType.includes("application/json")) {
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      return res.status(200).json(data);
    } else {
      // No es JSON, devuelvo texto plano para que el cliente lo reciba como string
      const text = await response.text();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      return res.status(200).send(text);
    }
  } catch (error) {
    console.error("Error en proxy:", error);
    res
      .status(500)
      .json({ error: "Error al obtener datos", details: error.message });
  }
}
