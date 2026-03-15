import type { LoaderFunctionArgs } from "react-router";
import puppeteer from "puppeteer";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const articleUrl = url.searchParams.get("url");
  const filename = url.searchParams.get("filename") || "character_sheet.pdf";
  const userToken = url.searchParams.get("token");

  console.log("[PDF API] Received request for URL:", articleUrl);

  if (!articleUrl) {
    return new Response("Missing URL parameter", { status: 400 });
  }

  let browser;
  try {
    // Launch Puppeteer
    console.log("[PDF API] Launching browser...");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1280, height: 1024 });

    console.log("[PDF API] Navigating to:", articleUrl);

    // Navigate to the article page first (to establish the domain)
    const response = await page.goto(articleUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    console.log("[PDF API] Page loaded, status:", response?.status());

    // If we have a user token, inject it into localStorage before the app hydrates
    if (userToken) {
      console.log("[PDF API] Injecting user token into localStorage");
      await page.evaluate((token) => {
        localStorage.setItem("WA_TOKEN", token);
      }, userToken);

      // Reload the page so the app picks up the token
      console.log("[PDF API] Reloading page with authentication...");
      await page.reload({
        waitUntil: "networkidle2",
        timeout: 60000,
      });
    } else {
      // Wait for network idle if no token injection needed
      await page.waitForNetworkIdle({ timeout: 60000 });
    }

    // Wait for the character sheet content to be loaded
    console.log("[PDF API] Waiting for character sheet content...");
    await page.waitForSelector(".characterSheetContent", {
      timeout: 60000,
      visible: true,
    });

    console.log("[PDF API] Character sheet content found!");

    // Extra wait for any dynamic content/images
    await page.waitForFunction(
      () => {
        const content = document.querySelector(".characterSheetContent");
        return content && content.children.length > 0;
      },
      { timeout: 10000 },
    );

    // Wait for images to load
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.addEventListener("load", resolve);
                img.addEventListener("error", resolve);
              }),
          ),
      );
    });

    console.log("[PDF API] Generating PDF...");

    // Generate PDF with print media emulation
    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      preferCSSPageSize: true,
    });

    console.log("[PDF API] PDF generated, size:", pdfBuffer.length, "bytes");

    await browser.close();

    // Return the PDF as a downloadable file
    return new Response(pdfBuffer.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[PDF API] Error:", error);
    if (browser) {
      await browser
        .close()
        .catch((e) => console.error("[PDF API] Error closing browser:", e));
    }
    return new Response(
      `PDF generation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}
