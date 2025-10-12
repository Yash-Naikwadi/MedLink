import { create } from "ipfs-http-client";
import fs from "fs";
import path from "path";

// Connect to local IPFS node
const client = create({ url: "http://127.0.0.1:5001/api/v0" });

export const uploadToIPFS = async (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const result = await client.add({ path: fileName, content: data });
    const cid = result.cid.toString();

    console.log("✅ File stored on local IPFS with CID:", cid);
    return `http://127.0.0.1:8080/ipfs/${cid}`; // local gateway
  } catch (err) {
    console.error("❌ IPFS upload failed:", err);
    throw err;
  }
};
