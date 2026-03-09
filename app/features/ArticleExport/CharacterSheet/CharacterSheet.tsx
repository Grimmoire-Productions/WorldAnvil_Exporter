import React from "react";
import parse from "html-react-parser";
import type { World } from "~/utils/types";

type CharacterSheetProps = {
  activeCharacter: string;
  cssClassName: World["cssClassName"] | "default";
};

function CharacterSheet({
  activeCharacter,
  cssClassName = "default",
}: CharacterSheetProps) {
  React.useEffect(() => {
    // Dynamically import the CSS file
    import(`./WorldStyles/${cssClassName}.css`);
    console.log(cssClassName);
  }, [cssClassName]);

  return <div className={cssClassName}>{parse(activeCharacter)}</div>;
}

export default CharacterSheet;
