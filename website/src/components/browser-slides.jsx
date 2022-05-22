import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function BrowserSlides({deckName}) {
    return (
      <BrowserOnly>
        {() => {
          const Slides = require("./slides").default;

          return <Slides deckName={deckName} />;
        }}
      </BrowserOnly>
    );
  }
