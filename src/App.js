import './App.css';
import { useRef, useState } from 'react';
import headerImage from './media/headerImage.png';
import footerImage from './media/footerImage.png';
import { LIES_VARS } from './consts'


async function FetchCharacter(charId, setActiveCharacter) {
  const response = await fetch(`https://www.worldanvil.com/api/external/boromir/article?id=${charId}&granularity=2`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-auth-token": process.env.REACT_APP_WA_GP_API_TOKEN,
      "x-application-key": process.env.REACT_APP_WA_API_KEY
    }
  })

  const data = await response.json();
  setActiveCharacter(await ProcessArticle(data));
}

async function FetchSecret(secretId) {
  const response = await fetch(`https://www.worldanvil.com/api/external/boromir/secret?id=${secretId}&granularity=0`, {
    headers: {
      "accept": "application/json",
      "x-auth-token": process.env.REACT_APP_WA_GP_API_TOKEN,
      "x-application-key": process.env.REACT_APP_WA_API_KEY
    }
  })

  const data = await response.json();
  return data.content;
}

async function ProcessArticle(data) {

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
      const hasVariableBeforeFootnote = str.includes(`[var:`) && str.indexOf("[var:") < str.indexOf("[sup]")
      
      /*
        if there is both a regular footnote and a variable in the same string of text
        and the variable comes first, execute replaceVar first
      */
      if (hasVariableBeforeFootnote) {
        replaceVariable(arrayContent[idx], LIES_VARS);
        replaceFootnote(arrayContent[idx]);
      } else {
        replaceFootnote(arrayContent[idx]);
      }
    }

    /* Format variables */
    /* using arrayContent[idx] to account for the fact that str may have been altered by the above code block */
    if (arrayContent[idx].includes(`[var:`)) {
      replaceVariable(arrayContent[idx], LIES_VARS)
    }

    function replaceFootnote(text) {
      const footnoteIdx = arrayFootnotes.findIndex((note) => note.includes(text.slice(text.indexOf("[sup]"), text.indexOf("[/sup]"))))
      arrayContent[idx] = text.replace(/(\[sup\][0-9]+\[\/sup\])/g, `<sup>${footnoteNum}</sup>`)
      arrayFootnotes[footnoteIdx] = `<p>${arrayFootnotes[footnoteIdx]}</p>`.replace(/(\[sup\][0-9]+\[\/sup\])/g, `<sup>${footnoteNum}</sup>`)
      
      /* Add "Notes" header if not already present */
      const footnoteHeaderIdx = arrayFootnotes.findIndex((note) => note.includes(`<h2>Notes</h2>`))

      if (footnoteHeaderIdx === -1) {
        arrayFootnotes.unshift('<h2>Notes</h2>');
      }
      
        
      footnoteNum += 1;
    }

    function replaceVariable(text, varList) {

      /* Get the correct variable data from the list of variabels */
      const varName = text.substring(text.indexOf(":", text.indexOf("var"))+1,text.indexOf("]",text.indexOf("var")))

      const {name, term, description} = varList.find((obj) => obj.name === varName)

      /* Determine if this variable has already gotten a footnote */
      const firstInstance = !arrayFootnotes.find((note) => note.includes(description))
      const contentText = firstInstance ? `${term}<sup>${footnoteNum}</sup>` : term
      const footnoteText = `<p><sup>${footnoteNum}</sup> ${description}</p>`

      /* Update the variable reference in the content */
      arrayContent[idx] = text.replace(`[var:${name}]`, contentText)

      /* Only add a new footnote if this is there isn't already one for this variable */

      if (firstInstance) {
        /* Determine if the index of the "Notes" header so we don't put any footnotes before it */
        let footnoteHeaderIdx = arrayFootnotes.findIndex((note) => note.includes(`<h2>Notes</h2>`))

        /* Add "Notes" header if not already present */
        if (footnoteHeaderIdx === -1) {
          arrayFootnotes.unshift('<h2>Notes</h2>');
          footnoteHeaderIdx = 0;
        }

        /* Determine the index of the footnote that will come before this one */
        const footnoteIdx = arrayFootnotes.findIndex((note) => note.includes(`<sup>${footnoteNum-1}</sup>`))

        /*
          If no footnotes come before this one, add new footnote after header
          Otherwise, add after preceeding footnote
        */
        if (footnoteIdx <= 0) {
          arrayFootnotes.splice(footnoteHeaderIdx + 1, 0, footnoteText)
        } else {
          arrayFootnotes.splice(footnoteIdx + 1, 0, footnoteText)
        }

        
        footnoteNum += 1
      }
    }
  })

  /* Enclose any footnotes in a div */
  if (arrayFootnotes.length > 0) {
    const lastFootnote = arrayFootnotes[arrayFootnotes.length - 1]
    arrayFootnotes[0] =  '<div class="notes">'.concat(arrayFootnotes[0]) 
    arrayFootnotes[arrayFootnotes.length-1] = lastFootnote.concat("</div>")
  }
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

async function processSecrets(arrayContent) {

  let i = 0;

  for (const str of arrayContent) {
    if(str.includes("secret:")) {
      const secretId = str.substring(
        str.indexOf(":")+1,
        str.indexOf("]")
      )
      let secretText = await FetchSecret(secretId);
      secretText = transformBBCode(secretText)
      secretText = transformWorldAnvilLinks(secretText)
      secretText = correctPunctuation(secretText)
      arrayContent[i] = `<p>${secretText}</p>`
    }
    i++;
  }

  return arrayContent;
}

function transformBBCode(data) {
  data = data.replaceAll("@", "");
  data = data.replaceAll("\r", "");
  data = data.replaceAll("[img:5090045]", ""); /* World Anvil header image */
  data = data.replace("[img:5090046]", "") /* World Anvil footer image */

  /* catch weird spacing within tags */
  data = data.replaceAll("[b] ", " <b>").replaceAll(" [/b]", "</b> ");
  data = data.replaceAll("[i] ", " <i>").replaceAll(" [/i]", "</i> ");

  /* Formatting tags */
  data = data.replaceAll("[i]", "<i>").replaceAll("[/i]", "</i>");
  data = data.replaceAll("[b]", "<b>").replaceAll("[/b]", "</b>");
  data = data.replaceAll("[br]", "\n")

  /* Text type tags */
  data = data.replaceAll("[p]", "<p>").replaceAll("[/p]", "</p>");
  data = data.replaceAll("[hr]", "<hr/>");
  data = data.replaceAll("[h1]", "<h1>").replaceAll("[/h1]", "</h1>");
  data = data.replaceAll("[h2]", "<h2>").replaceAll("[/h2]", "</h2>");
  data = data.replaceAll("[ul]", "<ul>").replaceAll("[/ul]", "</ul>");
  data = data.replaceAll("[li]", "<li>").replaceAll("[/li]", "</li>");
  data = data.replaceAll("[quote]", '<blockquote>').replaceAll("[/quote]", "</blockquote>");
  data = data.replaceAll("/*", "<!--").replaceAll("*/", "-->");
  return data;
}

function transformWorldAnvilLinks(data) {
  data = data.replace(/\s*\(person.*?\)\s*/g, ' ')
  data = data.replace(/\s*\(organization.*?\)\s*/g, ' ')
  data = data.replace(/\s*\(landmark.*?\)\s*/g, ' ')
  data = data.replace(/\s*\[Plot.*?\]\s*/g, '');
  data = data.replace(/\s*\(plot.*?\)\s*/g, '');
  data = data.replace(/\s*\(item.*?\)\s*/g, ' ');
  return data;
}

function correctPunctuation(data) {
  data = data.replaceAll(" - ", " &ndash; "); /* replace hypen with emdash */
  data = data.replaceAll(" .", ".") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(" ,", ",") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(" !", "!") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(" </b>", "</b>") /* Fixes formatting issue caused by prior replaces*/
  data = data.replaceAll(/"(?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/g, `“`) /* Replaces opening straight qutoes with curly */
  data = data.replaceAll(/"/g, `”`) /* Replaces closing straight qutoes with curly */
  data = data.replaceAll(/'/g, `’`) /* Replaces straight single quote with curly */
  data = data.replaceAll(" ’", "’") /* Fixes formatting issue caused by prior replaces*/
  return data;
}

function UserInput(setActiveCharacter) {
  const refArticleId = useRef(null);

  return (
    <div id='userInput'>
      <label>Article ID: <input type='text' id='articleId' name='Article ID' ref={refArticleId} /></label>
      <br />
      <button onClick={() => FetchCharacter(refArticleId.current.value, setActiveCharacter)}>Submit</button>
    </div>
  )
}

function createHtml(activeCharacter) {
  return { __html: activeCharacter }
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
