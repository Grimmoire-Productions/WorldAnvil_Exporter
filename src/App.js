import './App.css';
import { useRef, useState } from 'react';
import { ProcessArticle } from './utils/processArticle';
async function FetchCharacter(charId, type, setActiveCharacter) {
  const response = await fetch(`https://www.worldanvil.com/api/external/boromir/article?id=${charId}&granularity=2`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-auth-token": process.env.REACT_APP_WA_GP_API_TOKEN,
      "x-application-key": process.env.REACT_APP_WA_API_KEY
    }
  })

  const data = await response.json();
  setActiveCharacter(await ProcessArticle(data, type));
}

async function GenerateCharacterSheet(content, footnotes, type, setActiveCharacter) {
  const data = {
    content: content,
    footnotes: footnotes
  }
  console.log(data)
  setActiveCharacter(await ProcessArticle(data, type));
}

function UserInput(setActiveCharacter) {
  const refArticleId = useRef(null);
  const refArticleContent = useRef(null);
  const refArticleFootnote = useRef(null);

  return (
    <div id='userInput'>
      <div className="manualInput">
        <div className="field">
          <label for="articleContent">Content:</label>
          <br />
          <textarea name="articleContent" id="articleContent" ref={refArticleContent}></textarea>
        </div>
        <div className="field">
          <label for="articleFootnote">Footnotes:</label>
          <br />
          <textarea name="articleFootnote" id="articleFootnote" ref={refArticleFootnote}></textarea>
        </div>
        <div className="field">
          <button onClick={() => GenerateCharacterSheet(refArticleContent.current.value, refArticleFootnote.current.value, "manual", setActiveCharacter)}>Submit</button>
        </div>
      </div>
      <div className="apiInput">      <div className="field">
        <label>Article ID: <input type='text' id='articleId' name='Article ID' ref={refArticleId} /></label>
        <br />
        <button onClick={() => FetchCharacter(refArticleId.current.value, "api", setActiveCharacter)}>Submit</button>
      </div></div>

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

  //const buttonElement = document.getElementById('workaroundSubmitButton')

  // buttonElement.addEventListener('click', () => {
  // GenerateCharacterSheet(refArticleContent.current.value, refArticleFootnote.current.value, setActiveCharacter)
  //});

  return (
    <div className="App">
      {UserInput(setActiveCharacter)}
      {CharacterSheet(activeCharacter)}
    </div>
  );
}

export default App;
