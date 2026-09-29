import { createWriteStream, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import https from "https";

const PUBLIC_PATH = "C:\\Users\\ADMIN\\Downloads\\Roo-Code-main\\smartspace-picks\\public\\images\\guides";

const guidesToDownload = {
  "best-corner-standing-desk": {
    "fezibo-l-shaped-corner": "https://m.media-amazon.com/images/I/71vlFqe7+iL._AC_SL1500_.jpg",
    "vivo-corner-standing-desk": "https://m.media-amazon.com/images/I/719-sAd25AL._AC_SL1500_.jpg",
    "flexispot-e7l-corner": "https://m.media-amazon.com/images/I/61ve8iAp3kL._AC_SL1500_.jpg",
    "flexispot-ek5l-corner": "https://m.media-amazon.com/images/I/81hRNILWT4L._AC_SL1500_.jpg",
    "siago-corner-standing-desk": "https://m.media-amazon.com/images/I/71tE4RDzEzL._AC_SL1500_.jpg",
    "offico-corner-standing-desk": "https://m.media-amazon.com/images/I/81-6StF8zYL._AC_SL1500_.jpg",
    "acrolix-corner-standing-desk": "https://m.media-amazon.com/images/I/81JQN0EnNgL._AC_SL1500_.jpg",
    "fezibo-triple-motor-corner": "https://m.media-amazon.com/images/I/81UoYyaTcNL._AC_SL1500_.jpg",
  },
  "best-standing-desk-for-dual-monitors": {
    "desktronic-dual-monitor": "https://m.media-amazon.com/images/I/71ZMU5EPuZL._AC_SL1500_.jpg",
    "shw-dual-monitor": "https://m.media-amazon.com/images/I/819pj+V8QcL._AC_SL1500_.jpg",
    "flexispot-en1-maple": "https://m.media-amazon.com/images/I/71KwCPJpoAL._AC_SL1500_.jpg",
    "vivo-dual-monitor-desk": "https://m.media-amazon.com/images/I/61u2kVQis8L._AC_SL1500_.jpg",
    "fezibo-dual-monitor": "https://m.media-amazon.com/images/I/71jwqC-hN5L._AC_SL1500_.jpg",
    "flexispot-e6-bamboo-dual": "https://m.media-amazon.com/images/I/71G57ucOZtL._AC_SL1500_.jpg",
    "uplift-v3-dual-monitor": "https://m.media-amazon.com/images/I/71DIMqM35kL._AC_SL1500_.jpg",
    "shw-62-dual-monitor": "https://m.media-amazon.com/images/I/718Z9N7RgML._AC_SL1500_.jpg",
  },
  "best-standing-desk-48-inch": {
    "ergear-48-inch": "https://m.media-amazon.com/images/I/718KkXOCktL._AC_SL1500_.jpg",
    "flexispot-en1-48": "https://m.media-amazon.com/images/I/61qYqlizh2L._AC_SL1500_.jpg",
    "flexispot-en1-maple-48": "https://m.media-amazon.com/images/I/71KwCPJpoAL._AC_SL1500_.jpg",
    "flexispot-en2-48": "https://m.media-amazon.com/images/I/71GjWLqbuUL._AC_SL1500_.jpg",
    "flexispot-comhar-48": "https://m.media-amazon.com/images/I/71MTvT27CuL._AC_SL1500_.jpg",
    "vivo-48-inch": "https://m.media-amazon.com/images/I/617iLezWHYL._AC_SL1500_.jpg",
    "fezibo-48-inch": "https://m.media-amazon.com/images/I/71smFjr2QgL._AC_SL1500_.jpg",
    "huanuo-48-inch": "https://m.media-amazon.com/images/I/71CfxsqVXmL._AC_SL1500_.jpg",
  },
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (existsSync(dest)) {
      console.log(`  SKIP (exists): ${dest}`);
      return resolve();
    }
    const file = createWriteStream(dest);
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Referer": "https://www.amazon.com/",
      },
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      file.close();
      reject(err);
    });
  });
}

async function main() {
  for (const [slug, images] of Object.entries(guidesToDownload)) {
    const dir = resolve(PUBLIC_PATH, slug);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    for (const [id, url] of Object.entries(images)) {
      const dest = resolve(dir, `${id}.jpg`);
      try {
        await download(url, dest);
        console.log(`  ✓ ${slug}/${id}.jpg`);
      } catch (e) {
        console.error(`  ✗ ${slug}/${id}.jpg - ${e.message}`);
      }
    }
  }
  console.log("\nDone downloading images.");
}

main();
