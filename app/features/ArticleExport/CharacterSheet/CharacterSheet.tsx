import React from 'react';
import type { World } from '~/utils/types';

type CharacterSheetProps = {
  activeCharacter: string;
  cssClassName: World['cssClassName'] | 'default';
}

function CharacterSheet({ activeCharacter, cssClassName = 'default' }: CharacterSheetProps) {

  function createHtml(htmlString: string) {
    return { __html: htmlString }
  }

  React.useEffect(() => {
    // Dynamically import the CSS file
    import(`./WorldStyles/${cssClassName}.css`); 
    console.log(cssClassName)
  }, [cssClassName]);

  return (
    <div className={cssClassName} dangerouslySetInnerHTML={createHtml(activeCharacter)}>
    </div>
  );
}

export default CharacterSheet;