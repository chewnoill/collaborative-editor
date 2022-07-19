import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { usePreviewMdx } from "apollo/selectors";
import { useYDocValue } from "hooks/use-y-doc";
import { hydrate } from "mdx-hydra/build/hydrate";
import React, { useEffect, useRef } from "react";

function Hydrate(props: any) {
  return hydrate(props);
}

const PreviewWrapper = styled(Box)({});

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

function Img({ id, name, mime_type }) {
  return <img style={{ width: "100%" }} src={`/img/${id}`} alt={name} />;
}

export default function PreviewMdx({ id }: any) {
  const value = useYDocValue(id);
  const { data } = usePreviewMdx(id, value);

  const mdx = data?.render?.preview?.mdx;
  const prevMdx = usePrevious(mdx);
  const currentMdx = mdx || prevMdx;
  if (!currentMdx) return <div>loading...</div>;
  return (
    <PreviewWrapper sx={{}}>
      <Hydrate
        {...{
          ...currentMdx,
          components: {
            Img,
          },
          Wrapper: ({ children }) => children,
        }}
      />
    </PreviewWrapper>
  );
}
