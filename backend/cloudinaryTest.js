require("dotenv").config();
const crypto = require("crypto");

const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;

async function main() {
  console.log("Cloud name:", JSON.stringify(cloud));
  console.log("API key length:", key?.length, "| API secret length:", secret?.length);

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHash("sha1").update(`timestamp=${timestamp}${secret}`).digest("hex");

  // A 1x1 transparent PNG
  const tinyPng =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

  const form = new FormData();
  form.append("file", tinyPng);
  form.append("api_key", key);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: form });
  const body = await res.text();

  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get("content-type"));
  console.log("Body:", body.slice(0, 600));
}

main().catch((e) => console.error("Request failed:", e.message));