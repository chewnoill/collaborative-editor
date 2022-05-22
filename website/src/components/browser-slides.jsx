import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function BrowserSlides({deckName}) {
    return (
      <BrowserOnly>
        {() => {
          const Slides = require("./slides");
          return <Slides deckName={deckName} />;
        }}
      </BrowserOnly>
    );
  }
