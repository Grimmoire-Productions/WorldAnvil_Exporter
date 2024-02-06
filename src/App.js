import './App.css';
import { useRef, useState } from 'react';
import headerImage from './media/headerImage.png';
import footerImage from './media/footerImage.png';

async function FetchCharacter(charId, setActiveCharacter) {
  const response = await fetch("https://www.worldanvil.com/api/external/boromir/article?id=" + charId + "&granularity=2", {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-auth-token": process.env.REACT_APP_WA_GP_API_TOKEN,
      "x-application-key": process.env.REACT_APP_WA_API_KEY
    }
  })

  const data = await response.json();
  setActiveCharacter(ProcessArticle(data));
}

function ProcessArticle(data) {
  let content = data.content;
  let footnotes = data.footnotes;

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

  /* Format Secrets */
  content = content.replace(/\s*\[secret.*?\]\s*/g, 'Secret Placeholder');

  /* Enclose any footnotes in a div */
  if (footnotes.trim().length > 0) {
    footnotes = '<div class="notes"><h2>Notes</h2>'.concat(footnotes, '</div>')
  }

  /* Handle special cases */
  const arrayContent = content.split("\n");
  const arrayFootnotes = footnotes.split("\n")

  let footnoteNum = 1;
  arrayContent.forEach((str, idx) => {

    // Create divs from containers
    if (str.includes("[container:")) {
      arrayContent[idx] = str.replace("[container: ", `<div class="`).replace("[container:", `<div class="`).replace("]", `">`);
    }

    // Stats formatting
    if (str.includes("Rank:")) {
      arrayContent[idx] = str.replace(/\s\s*\|\s*/g, `&emsp;&emsp;|&emsp;&emsp;`).replaceAll(/>\s+/g, '>&emsp;')
    }

    // Apply quote class correctly
    if (str.includes(`”|`) || str.includes(`"|`)) {
      arrayContent[idx] = str.replace(`|`, `<div class="author">&ndash; `).concat('</div>');
    }

    /* Format footnotes */
    if (str.includes`[sup]`) {
      const footnoteIdx = arrayFootnotes.findIndex((note) => note.includes(str.slice(str.indexOf("[sup]"), str.indexOf("[/sup]"))))

      arrayContent[idx] = str.replace(/(\[sup\][0-9]+\[\/sup\])/g, `<sup>${footnoteNum}</sup>`)
      
      
      arrayFootnotes[footnoteIdx] = arrayFootnotes[footnoteIdx].replace(/(\[sup\][0-9]+\[\/sup\])/g, `<sup>${footnoteNum}</sup>`)
        
      footnoteNum += 1;
    }
    if (str.includes`[var:marquess-grimmoireproductions]`) {
      const noteText = `<sup>${footnoteNum}</sup> Pronounced "MAR-kwess" not "mar-KEY"`
      const noteHeaderIdx = arrayFootnotes.findIndex((note) => note.includes(`<h2>Notes</h2>`))
      const footnoteIdx = arrayFootnotes.findIndex((note) => note.includes(`<sup>${footnoteNum}</sup>`))

      arrayContent[idx] = str.replace("[var:marquess-grimmoireproductions]", `Marquess<sup>${footnoteNum}</sup>`)

      if (footnoteIdx <= 0) {
        arrayFootnotes.splice(noteHeaderIdx + 1, 0, noteText)
      } else {
        arrayFootnotes.splice(footnoteIdx, 0, noteText)
      }

      footnoteNum += 1;
    }

    if (str.includes`[var:ton-grimmoireproductions]`) {
      const noteText = `<sup>${footnoteNum}</sup> The Ton was the high society in the United Kingdom during the Regency era.`
      const noteHeaderIdx = arrayFootnotes.findIndex((note) => note.includes(`<h2>Notes</h2>`))
      const footnoteIdx = arrayFootnotes.findIndex((note) => note.includes(`<sup>${footnoteNum+1}</sup>`))

      arrayContent[idx] = str.replace("[var:ton-grimmoireproductions]", `Ton<sup>${footnoteNum+1}</sup>`)

      if (footnoteIdx <= 0) {
        arrayFootnotes.splice(noteHeaderIdx + 1, 0, noteText)
      } else {
        arrayFootnotes.splice(footnoteIdx, 0, noteText)
      }

      footnoteNum += 1;

    }
  })

  const joinedFootnotes = arrayFootnotes.join("\n")
  
  // Add header and footer images around the main character sheet content
  arrayContent.unshift(`<header class="center"><img src="${headerImage}"/></header>
  <table>
    <thead><tr><td><div class="header-space">&nbsp;</div></td></tr></thead>
    <tbody>
    <tr><td><div class="characterSheetContent">`)
  arrayContent.push(joinedFootnotes)
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

function transformBBCode(data) {
  data = data.replaceAll("@", "");
  data = data.replaceAll("\r", "");
  data = data.replaceAll("[img:5090045]", ""); /* World Anvil header image */
  data = data.replace("[img:5090046]", "") /* World Anvil footer image */
  data = data.replaceAll("[p]", "<p>").replaceAll("[/p]", "</p>");
  data = data.replaceAll("[b]", "<b>").replaceAll("[/b]", "</b>");
  data = data.replaceAll("[i]", "<i>").replaceAll("[/i]", "</i>");
  data = data.replaceAll("[b]", "<b>").replaceAll("[/b]", "</b>");
  data = data.replaceAll("[hr]", "<hr/>");
  data = data.replaceAll("[h1]", "<h1>").replaceAll("[/h1]", "</h1>");
  data = data.replaceAll("[h2]", "<h2>").replaceAll("[/h2]", "</h2>");
  data = data.replaceAll("[ul]", "<ul>").replaceAll("[/ul]", "</ul>");
  data = data.replaceAll("[li]", "<li>").replaceAll("[/li]", "</li>");
  data = data.replaceAll("[br]", "")
  data = data.replaceAll("[quote]", '<blockquote>').replaceAll("[/quote]", "</blockquote>");
  return data;
}

function transformWorldAnvilLinks(data) {
  data = data.replace(/\s*\(person.*?\)\s*/g, ' ')
  data = data.replace(/\s*\(organization.*?\)\s*/g, ' ')
  data = data.replace(/\s*\(landmark.*?\)\s*/g, ' ')
  data = data.replace(/\s*\[Plot.*?\]\s*/g, '');
  data = data.replace(/\s*\(plot.*?\)\s*/g, '');
  return data;
}

function correctPunctuation(data) {
  data = data.replaceAll(" - ", " &ndash; "); /* replace hypen with emdash */
  data = data.replaceAll(" .", ".") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(" ,", ",") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(/"(?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/g, `“`) /* Replaces opening straight qutoes with curly */
  data = data.replaceAll(/"/g, `”`) /* Replaces closing straight qutoes with curly */
  data = data.replaceAll(/'/g, `’`) /* Replaces straight single quote with curly */
  return data;
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
