// import headerImage from '../assets/LiesAndLiability/header.png'
// import footerImage from '../assets/LiesAndLiability/footer.png';
import { transformBBCode, transformWorldAnvilLinks, correctPunctuation } from './formatter.ts';
import { processSecrets } from './processSecrets.ts';
import { processFootnotes } from './processFootnotes.ts';
import type { ArticleResponse } from './types.ts';



export async function ProcessArticle(data: ArticleResponse, selectedWorldKey: string) {
  let headerImageSrc: string;
  let footerImageSrc: string;

  try {
    const headerImage = await import(
      `../assets/${selectedWorldKey}/header.png`
    );
    headerImageSrc = headerImage.default;
  } catch (error) {
    console.error(
      `Failed to load header image for world: ${selectedWorldKey}`,
      error
    );
    headerImageSrc = ""; // Or a path to a default/placeholder image
  }

  try {
    const footerImage = await import(
      `../assets/${selectedWorldKey}/footer.png`
    );
    footerImageSrc = footerImage.default;
  } catch (error) {
    console.error(
      `Failed to load header image for world: ${selectedWorldKey}`,
      error
    );
    footerImageSrc = ""; // Or a path to a default/placeholder image
  }
  
  let content = data.content;
  let footnotes = data.footnotes ? data.footnotes : ""

  /* Transform BBCode tags to HTML equivalents */
  content = transformBBCode(content)
  footnotes = transformBBCode(footnotes)
  
  /* Misc handling */
  content = content.replaceAll("[center]", "").replaceAll("[/center]", ""); /* Will be handled with class styling to ensure standardization */
  content = content.replaceAll("[/container]", "</div>");

  /* Transform World Anvil links */
  content = transformWorldAnvilLinks(content)
  footnotes = transformWorldAnvilLinks(footnotes)

  /* Punctuation correction */
  content = correctPunctuation(content)
  footnotes = correctPunctuation(footnotes)

  /* Handle special cases */
  let arrayContent = content.split("\n");
  const arrayFootnotes = footnotes.split("\n")
  arrayContent = await processSecrets(arrayContent);

  arrayContent.forEach((str, idx) => {

    // Create divs from containers or add misisng paragraph
    if (str.includes("[container:")) {
      arrayContent[idx] = str.replace("[container: ", `<div class="`).replace("[container:", `<div class="`).replace("]", `">`);
    }

    // Stats formatting for Lies & Liability
    if (str.includes("Rank:")) {
      arrayContent[idx] = str.replace(/\s\s*\|\s*/g, `&emsp;&emsp;|&emsp;&emsp;`).replaceAll(/>\s+/g, '>&emsp;')
    }

    // Apply quote class correctly
    if (
      str.includes(`”|`) ||
      str.includes(`"|`) ||
      (str.includes("|") && str.includes("</blockquote>"))
    ) {
      arrayContent[idx] = str.replace(`|`, `<div class="author">&ndash; `);

      if (str.includes("</blockquote>")) {
        arrayContent[idx] = arrayContent[idx].replace(
          "</blockquote>",
          "</div></blockquote>",
        );
      } else {
        arrayContent[idx] = arrayContent[idx].concat("</div>");
      }
    }
  })

  processFootnotes(arrayContent, arrayFootnotes)

  if (arrayFootnotes.length > 0) {
    /* Add "Notes" header if not already present */
    const footnoteHeaderIdx = arrayFootnotes.findIndex((note) => note.includes(`<h2>Notes</h2>`))

    if (footnoteHeaderIdx === -1) { arrayFootnotes.unshift('<h2>Notes</h2>') };

    /* Enclose any footnotes in a div */
    const lastFootnote = arrayFootnotes[arrayFootnotes.length - 1]
    arrayFootnotes[0] =  '<div class="notes">'.concat(arrayFootnotes[0]) 
    arrayFootnotes[arrayFootnotes.length-1] = lastFootnote.concat("</div>")
  }

  // combine content and footnotes arrays
  arrayContent = arrayContent.concat(arrayFootnotes)
  
  // Add header and footer images around the main character sheet content
  arrayContent.unshift(`<header class="center"><img src="${headerImageSrc}"/></header>
  <table>
    <thead><tr><td><div class="header-space">&nbsp;</div></td></tr></thead>
    <tbody>
    <tr><td><div class="characterSheetContent">`)
  arrayContent.push(`</div></td></tr>
    </tbody>
    <tfoot><tr><td><div class="footer-space">&nbsp;</div></td></tr></tfoot>
    </table>
    <footer class="center">
        <img src="${footerImageSrc}"/>
    </footer>`)

  let joinedContent = arrayContent.join("\n");
  joinedContent = joinedContent.replaceAll("[", "");
  joinedContent = joinedContent.replaceAll("]", "");

  return (
    joinedContent
  )
}