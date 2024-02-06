import './App.css';
import { useRef, useState } from 'react';
import headerImage from './media/headerImage.png';
import footerImage from './media/footerImage.png';

async function FetchCharacter(charId, setActiveCharacter) {
  const response = await fetch("https://www.worldanvil.com/api/external/boromir/article?id=" + charId + "&granularity=1", {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-auth-token": process.env.REACT_APP_WA_GP_API_TOKEN,
      "x-application-key": process.env.REACT_APP_WA_API_KEY
    }
  })

  const data = await response.json();
  setActiveCharacter(ProcessArticle(data.content));
}

function ProcessArticle(content) {
  content = content.replaceAll("@", "");
  content = content.replaceAll("\r", "");
  content = content.replaceAll("[img:5090045]", "");

  /* Transform BBCode tags to HTML equivalents */
  content = content.replaceAll("[p]", "<p>").replaceAll("[/p]", "</p>");
  content = content.replaceAll("[b]", "<b>").replaceAll("[/b]", "</b>");
  content = content.replaceAll("[i]", "<i>").replaceAll("[/i]", "</i>");
  content = content.replaceAll("[hr]", "<hr/>");
  content = content.replaceAll("[h1]", "<h1>").replaceAll("[/h1]", "</h1>");
  content = content.replaceAll("[h2]", "<h2>").replaceAll("[/h2]", "</h2>");
  content = content.replaceAll("[ul]", "<ul>").replaceAll("[/ul]", "</ul>");
  content = content.replaceAll("[li]", "<li>").replaceAll("[/li]", "</li>");
  content = content.replaceAll("[br]", "<br>").replaceAll("[/li]", "</li>");
  content = content.replaceAll("[quote]", '<blockquote>').replaceAll("[/quote]", "</blockquote>");
  content = content.replaceAll("[center]", '<div class="center">').replaceAll("[/center]", "</div>");
  content = content.replaceAll("[/container]", "</div>");

  /* Format footnotes */
  content = content.replaceAll("[var:ton-grimmoireproductions]", "Ton");

  /* Format World Anvil links */
  content = content.replace(/\s*\(person.*?\)\s*/g, ' ')
  content = content.replace(/\s*\(organization.*?\)\s*/g, ' ')
  content = content.replace(/\s*\(landmark.*?\)\s*/g, ' ')

  /* Punctuation correction */
  content = content.replaceAll(" - ", " &ndash; "); /* replace hypen with emdash */
  content = content.replaceAll(" .", ".") /* Fixes formatting issue caused by prior replaces*/
  content = content.replaceAll(/\s*\|\s*/g, `&emsp;&emsp;|&emsp;&emsp;`)

  /* Format Secrets */
  content = content.replace(/\s*\[secret.*?\]\s*/g, 'Secret Placeholder');

  /* Handle special cases */
  var arrayContent = content.split("\n");
  arrayContent.forEach((str, idx) => {

    // Create divs from containers
    if (str.includes("[container:")) {
      arrayContent[idx] = str.replace("[container: ", `<div class="`).replace("[container:", `<div class="`).replace("]", `">`);
    }

    // apply quote class correctly
    if (str.includes(`”|`) || str.includes(`"|`)) {
      arrayContent[idx] = str.replace(`|`, `<div class="author">— `).concat('</div>');
    }
  })

  arrayContent = arrayContent.filter(function (str) { return !str.includes("[Plot") });
  
  // Add header and footer images around the main character sheet content
  arrayContent.unshift(`<header class="center"><img src="${headerImage}"/></header>
  <table>
    <thead><tr><td><div class="header-space">&nbsp;</div></td></tr></thead>
    <tbody>
    <tr><td><div class="characterSheetContent">`)
  arrayContent.push(`</div></td></tr>
    </tbody>
    <tfoot><tr><td><div class="footer-space">&nbsp;</div></td></tr></tfoot>
    </table>
    <footer class="center">
        <img src="${footerImage}"/>
    </footer>`)

  var joinedContent = arrayContent.join("\n");
  joinedContent = joinedContent.replaceAll("[", "");
  joinedContent = joinedContent.replaceAll("]", "");


  return (
    joinedContent
  )
}

function UserInput(setActiveCharacter) {
  const refArticleId = useRef(null);

  return (
    <div id='userInput'>
      <label>Article ID: <input type='text' id='articleId' name='Article ID' ref={refArticleId}/></label>
      <br/>
      <button onClick={() => FetchCharacter(refArticleId.current.value, setActiveCharacter)}>Submit</button>
    </div>
  )
}

function createHtml(activeCharacter) {
  return {__html: activeCharacter}
}

function CharacterSheet(activeCharacter) {
  return (
    <div dangerouslySetInnerHTML={createHtml(activeCharacter)}>
    </div>
  )
}

function App() {
  const [activeCharacter, setActiveCharacter] = useState('');

  return (
    <div className="App">
      {UserInput(setActiveCharacter)}
      {CharacterSheet(activeCharacter)}
    </div>
  );
}

export default App;
