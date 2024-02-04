import './App.css';
import { useRef, useState } from 'react';
import headerImage from './media/headerImage.png';
import footerImage from './media/footerImage.png';

async function FetchCharacter(charId, auth, key, setActiveCharacter) {
  const response = await fetch("https://www.worldanvil.com/api/external/boromir/article?id=" + charId + "&granularity=1", {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-auth-token": auth,
      "x-application-key": key
    }
  })

  const data = await response.json();
  setActiveCharacter(ProcessArticle(data.content));
}

function ProcessArticle(content) {
  content = content.replaceAll("@", "");
  content = content.replaceAll("\r", "");
  content = content.replaceAll("[p]", "<p>").replaceAll("[/p]", "</p>");
  content = content.replaceAll("[b]", "<b>").replaceAll("[/b]", "</b>");
  content = content.replaceAll("[i]", "<i>").replaceAll("[/i]", "</i>");
  content = content.replaceAll("[hr]", "<hr/>");
  content = content.replaceAll("[h1]", "<h1>").replaceAll("[/h1]", "</h1>");
  content = content.replaceAll("[h2]", "<h2>").replaceAll("[/h2]", "</h2>");
  content = content.replaceAll("[ul]", "<ul>").replaceAll("[/ul]", "</ul>");
  content = content.replaceAll("[li]", "<li>").replaceAll("[/li]", "</li>");
  content = content.replaceAll("[quote]", '<div class="center quote">').replaceAll("[/quote]", "</div>");
  content = content.replaceAll("[center]", '<div class="center">').replaceAll("[/center]", "</div>");
  content = content.replaceAll("[var:ton-grimmoireproductions]", "Ton");

  content = content.replace(/\s*\(person.*?\)\s*/g, '')
  content = content.replace(/\s*\(organization.*?\)\s*/g, '')
  content = content.replace(/\s*\(landmark.*?\)\s*/g, '')
  content = content.replace(/\s*\[secret.*?\]\s*/g, 'Secret Placeholder');

  var arrayContent = content.split("\n");
  arrayContent.shift();
  arrayContent = arrayContent.filter(function (str) { return !str.includes("[Plot")});
  arrayContent = arrayContent.filter(function (str) { return !str.includes("[container")});
  arrayContent = arrayContent.filter(function (str) { return !str.includes("[/container") });
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
  const refApiKey = useRef(null);
  const refAuthToken = useRef(null);

  return (
    <div id='userInput'>
      <label>Article ID: <input type='text' id='articleId' name='Article ID' ref={refArticleId}/></label>
      <br/>
      <label>API Key: <input type='text' id='apiKey' name='API Key' ref={refApiKey}/></label>
      <br/>
      <label>Auth Token: <input type='text' id='authenticationToken' name='Authentication Token' ref={refAuthToken}/></label>
      <br/>
      <button onClick={() => FetchCharacter(refArticleId.current.value, refAuthToken.current.value, refApiKey.current.value, setActiveCharacter)}>Submit</button>
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
