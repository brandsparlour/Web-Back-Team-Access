import { createHmac } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SECRETHASHKEY = process.env.WEB_BACK_TEAM_ACCESS_SECRET_HASH_KEY!;

// The function accepts the payload as a param (request payload object) and returns a HMAC string
export const generateHash = (data: any, hash?: string) => {
  // Use crypto to create an instance of hmac using algorithm sha1 and the secret key from ENV
  const hmac = createHmac(hash ? hash : "sha1", SECRETHASHKEY);

  //update hmac using the payload after stringify-ing it
  hmac.update(data);

  // Type cast the hash to a string and return
  return hmac.digest("hex");
};

// Function to compare hashed string with actual value
export const compareHash = (currentString: string, hashedString: string) => {
  // Generate the hash for the entered string using the same method and parameters
  const currentStringHashed = generateHash(currentString);

  // Compare the entered string hash with the already stored hashed string
  return currentStringHashed === hashedString;
};
