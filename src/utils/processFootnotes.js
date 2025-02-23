import { LIES_VARS } from './consts';

export function processFootnotes(arrayContent, arrayFootnotes) {
  let idx = 0;
  let footnoteNum = 1;

  for (const str of arrayContent) {
    const hasVariable = str.includes(`[var:`);
    const hasFootnote = str.includes`[sup]`
    let newString = str;

    if (hasFootnote) {
      const superscript = getOriginalSuperscript(newString);

      const footnoteIdx = arrayFootnotes.findIndex((note) => note.includes(superscript))
      const footnoteHasParagraphTags = arrayFootnotes[footnoteIdx].includes('<p>') && arrayFootnotes[footnoteIdx].includes('</p>')

      const hasVariableBeforeFootnote = hasVariable && str.indexOf("[var:") < str.indexOf("[sup]");

      /*
        if there is both a regular footnote and a variable in the same string of text
        and the variable comes first, replace the variable before updating the footnote superscript
      */
      if (hasVariableBeforeFootnote) {
        const varName = getVariableName(newString);
        const varData = getVarData(varName, LIES_VARS)
        const isFirstInstance = checkIfFirstInstance(arrayFootnotes, varData.text)
        
        newString = replaceVariable(newString, varData, footnoteNum, isFirstInstance)

        if (isFirstInstance) {
          addVariableFootnote(arrayFootnotes, footnoteNum, varData.description)
          footnoteNum += 1;
        };
      }

      /* Update footnote superscript */
      newString = newString.replace(superscript, `<sup>${footnoteNum}</sup>`)
      arrayFootnotes[footnoteIdx] = arrayFootnotes[footnoteIdx].replace(superscript, `<sup>${footnoteNum}</sup>`)

      /* Add missing paragraph tags */
      if (!footnoteHasParagraphTags) {
        arrayFootnotes[footnoteIdx] = '<p>'.concat(arrayFootnotes[footnoteIdx], '</p>')
      }
      footnoteNum += 1;
    } else if (hasVariable) {
      const varName = getVariableName(newString);
      const varData = getVarData(varName, LIES_VARS)
      const isFirstInstance = checkIfFirstInstance(arrayFootnotes, varData.description)

      newString = replaceVariable(newString, varData, footnoteNum, isFirstInstance)

      if (isFirstInstance) {
        addVariableFootnote(arrayFootnotes, footnoteNum, varData.description)
        footnoteNum += 1;
      };
      
    }

    arrayContent[idx] = newString;

    idx++
  }
}

function getOriginalSuperscript(text) {
  return text.match(/(\[sup\][0-9]+\[\/sup\])/g).toString()
}

function getVarData(varName, varsArray) {
  return varsArray.find((obj) => obj.name === varName)
}

function checkIfFirstInstance(array, text) {
  return !array.find((note) => note.includes(text))
}

function getVariableName(text) {
  return text.substring(text.indexOf(":", text.indexOf("var"))+1,text.indexOf("]",text.indexOf("var")))
}

function replaceVariable(string, varData, footnoteNum, isFirstInstance) {
    return isFirstInstance ? string.replace(`[var:${varData.name}]`, `${varData.term}<sup>${footnoteNum}</sup>`) : string.replace(`[var:${varData.name}]`, varData.term)
}

function addVariableFootnote(array, footnoteNum, description) {

  const footnoteText = `<p><sup>${footnoteNum}</sup> ${description}</p>`

  /* 
    Determine if the index of the "Notes" header so we don't put any footnotes before it
    will return -1 if no "Notes" header is found
  */
  const footnoteHeaderIdx = array.findIndex((note) => note.includes(`<h2>Notes</h2>`))

  /* Determine the index of the footnote that will come before this one */
  const footnoteIdx = array.findIndex((note) => note.includes(`<sup>${footnoteNum-1}</sup>`))

  /*
    If no footnotes come before this one, add new footnote after header
    Otherwise, add after preceeding footnote
  */
  if (footnoteIdx <= 0) {
    array.splice(footnoteHeaderIdx + 1, 0, footnoteText)
  } else {
    array.splice(footnoteIdx + 1, 0, footnoteText)
  }
}