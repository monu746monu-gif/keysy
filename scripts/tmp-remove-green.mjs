import fs from "node:fs/promises";
import zlib from "node:zlib";
import { promisify } from "node:util";

const inflate = promisify(zlib.inflate);
const deflate = promisify(zlib.deflate);

function crc32(buf) {
  if (!crc32.table) {
    crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crc32.table[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (const byte of buf) c = crc32.table[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data = Buffer.alloc(0)) {
  const typeBuf = Buffer.from(type, "ascii");
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuf.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 8 + data.length);
  return out;
}

function unfilter(scan, width, height, channels) {
  const rowLen = width * channels;
  const out = Buffer.alloc(rowLen * height);
  let inPos = 0;
  let outPos = 0;

  for (let y = 0; y < height; y++) {
    const filter = scan[inPos++];
    for (let x = 0; x < rowLen; x++) {
      const raw = scan[inPos++];
      const left = x >= channels ? out[outPos + x - channels] : 0;
      const up = y > 0 ? out[outPos + x - rowLen] : 0;
      const upLeft = y > 0 && x >= channels ? out[outPos + x - rowLen - channels] : 0;
      let value = raw;

      if (filter === 1) value = raw + left;
      else if (filter === 2) value = raw + up;
      else if (filter === 3) value = raw + Math.floor((left + up) / 2);
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        value = raw + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft);
      } else if (filter !== 0) {
        throw new Error(`Unsupported PNG filter ${filter}`);
      }

      out[outPos + x] = value & 255;
    }
    outPos += rowLen;
  }

  return out;
}

async function readPng(path) {
  const buf = await fs.readFile(path);
  if (buf.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error("Not a PNG");
  }

  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idats = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    pos += 4;
    const type = buf.subarray(pos, pos + 4).toString("ascii");
    pos += 4;
    const data = buf.subarray(pos, pos + len);
    pos += len + 4;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "IDAT") {
      idats.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG bitDepth=${bitDepth} colorType=${colorType}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const scan = await inflate(Buffer.concat(idats));
  return { width, height, channels, data: unfilter(scan, width, height, channels) };
}

async function writePng(path, width, height, rgba) {
  const rowLen = width * 4;
  const scan = Buffer.alloc((rowLen + 1) * height);

  for (let y = 0; y < height; y++) {
    scan[y * (rowLen + 1)] = 0;
    rgba.copy(scan, y * (rowLen + 1) + 1, y * rowLen, (y + 1) * rowLen);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  await fs.writeFile(
    path,
    Buffer.concat([
      Buffer.from("89504e470d0a1a0a", "hex"),
      chunk("IHDR", ihdr),
      chunk("IDAT", await deflate(scan, { level: 9 })),
      chunk("IEND"),
    ]),
  );
}

const [src, outPath] = process.argv.slice(2);
const img = await readPng(src);
const rgba = Buffer.alloc(img.width * img.height * 4);
let minX = img.width;
let minY = img.height;
let maxX = -1;
let maxY = -1;

for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    const si = (y * img.width + x) * img.channels;
    const di = (y * img.width + x) * 4;
    let r = img.data[si];
    let g = img.data[si + 1];
    let b = img.data[si + 2];
    const greenScore = g - Math.max(r, b);
    let a = 255;

    if (g > 35 && greenScore > 8 && g > r * 1.08 && g > b * 1.08) {
      a = greenScore >= 75 ? 0 : Math.max(0, Math.min(255, Math.round(((75 - greenScore) / 53) * 255)));
      g = Math.max(0, Math.round(g - Math.max(0, greenScore - 10) * 0.75));
    }

    rgba[di] = r;
    rgba[di + 1] = g;
    rgba[di + 2] = b;
    rgba[di + 3] = a;

    if (a > 8) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
}

const pad = 28;
minX = Math.max(0, minX - pad);
minY = Math.max(0, minY - pad);
maxX = Math.min(img.width - 1, maxX + pad);
maxY = Math.min(img.height - 1, maxY + pad);

const width = maxX - minX + 1;
const height = maxY - minY + 1;
const cropped = Buffer.alloc(width * height * 4);

for (let y = 0; y < height; y++) {
  rgba.copy(
    cropped,
    y * width * 4,
    ((minY + y) * img.width + minX) * 4,
    ((minY + y) * img.width + minX + width) * 4,
  );
}

await writePng(outPath, width, height, cropped);
