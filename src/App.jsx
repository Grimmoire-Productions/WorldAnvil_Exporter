import './App.css';
import { useRef, useState } from 'react';
import { ProcessArticle } from './utils/processArticle';

async function FetchCharacter(charId, setActiveCharacter) {
  const response = await fetch(`https://www.worldanvil.com/api/external/boromir/article?id=${charId}&granularity=2`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-auth-token": import.meta.env.VITE_PUBLIC_WA_API_TOKEN,
      "x-application-key": import.meta.env.VITE_PUBLIC_APPLICATION_KEY
    }
  })

  const data = await response.json();
  setActiveCharacter(await ProcessArticle(data));
}

function UserInput(setActiveCharacter) {
  const refArticleId = useRef(null);

  return (
    <div id='userInput'>
      <label>Article ID: <input type='text' id='articleId' data-testid="articleId" name='Article ID' ref={refArticleId} /></label>
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

function AppOld() {
  const [activeCharacter, setActiveCharacter] = useState('');

  const userInitialValues = {
    isLoggedIn: false,
    user: null,
    accessToken: null,
    expiresAt: null,
  };

  return (
    <div className="App">
      {UserInput(setActiveCharacter)}
      {CharacterSheet(activeCharacter)}
    </div>
  );
}

export default AppOld;
