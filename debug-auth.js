#!/usr/bin/env node

/**
 * Debug script to test World Anvil API authentication directly
 * Run this with: node debug-auth.js YOUR_USER_TOKEN
 */

import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "./server/.env" });

const WORLD_ANVIL_BASE_URL = "https://www.worldanvil.com/api/external/boromir";
const IDENTITY_ENDPOINT = "/identity";

async function testWorldAnvilAuth(userToken, appKey) {
  console.log("=== World Anvil API Authentication Test ===");
  console.log(
    "User Token:",
    userToken ? `${userToken.substring(0, 10)}...` : "null",
  );
  console.log("App Key:", appKey ? `${appKey.substring(0, 10)}...` : "null");
  console.log("");

  const url = `${WORLD_ANVIL_BASE_URL}${IDENTITY_ENDPOINT}`;
  console.log("Request URL:", url);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (userToken) {
    headers["x-auth-token"] = userToken;
  }

  if (appKey) {
    headers["x-application-key"] = appKey;
  }

  console.log("Request Headers:");
  Object.entries(headers).forEach(([key, value]) => {
    if (key.includes("token") || key.includes("key")) {
      console.log(`  ${key}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`  ${key}: ${value}`);
    }
  });
  console.log("");

  try {
    console.log("Making request...");
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    console.log("Response Status:", response.status, response.statusText);
    console.log(
      "Response Headers:",
      Object.fromEntries(response.headers.entries()),
    );

    const responseText = await response.text();
    console.log("Raw Response Body:", responseText);

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log("✅ SUCCESS - User authenticated:");
        console.log("  Username:", data.username);
        console.log("  User ID:", data.id);
        return { success: true, data };
      } catch (e) {
        console.log("❌ PARSING ERROR - Response is not valid JSON");
        return { success: false, error: "Invalid JSON response" };
      }
    } else {
      console.log("❌ REQUEST FAILED");

      // Try to parse error response
      try {
        const errorData = JSON.parse(responseText);
        console.log("Error Details:", errorData);
        return { success: false, error: errorData };
      } catch (e) {
        console.log("Raw error response (not JSON):", responseText);
        return { success: false, error: responseText };
      }
    }
  } catch (error) {
    console.log("❌ NETWORK ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);

  const userToken = args[0] || process.env.WA_API_TOKEN;
  const appKey = args[1] || process.env.WA_API_KEY;

  if (!userToken) {
    console.log("❌ No usert token available. Either:");
    console.log(
      "  1. Provide as first argument: node debug-auth.js USER_TOKEN",
    );
    console.log("  2. Set WA_API_TOKEN in server/.env file");
    process.exit(1);
  }

  if (!appKey) {
    console.log("❌ No application key available. Either:");
    console.log(
      "  1. Provide as second argument: node debug-auth.js USER_TOKEN APP_KEY",
    );
    console.log("  2. Set WA_API_KEY in server/.env file");
    process.exit(1);
  }

  console.log("=== Testing API Call ===");
  const result1 = await testWorldAnvilAuth(userToken, appKey);
  console.log("");
  console.log("Result:", result1.success ? "✅ PASSED" : "❌ FAILED");
  console.log("");

  if (!result1.success) {
    console.log("");
    console.log("🔍 Troubleshooting steps:");
    console.log("1. Check if your user token is valid and not expired");
    console.log("2. Verify the app key is correct");
    console.log("3. Check if World Anvil API is accessible from your network");
    console.log(
      "4. Ensure both tokens are properly formatted (no extra spaces/newlines)",
    );
  }
}

main().catch(console.error);
