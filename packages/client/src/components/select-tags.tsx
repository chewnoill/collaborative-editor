import { selectYDocument } from "ducks/appState/y-doc";
import React from "react";
import { useSelector } from "react-redux";
import Creatable from "react-select/creatable";
import { gql, useQuery } from "@apollo/client";

export function usePopularTags() {
  return useQuery(
    gql`
      query getPopularTags {
        tags {
          popular {
            tag
          }
        }
      }
    `,
    { fetchPolicy: "cache-first" }
  );
}

function SelectTags({ document_id }) {
  const { loading, data } = usePopularTags();

  const [tags, setTags] = React.useState(null);
  const values = tags && tags.map((value) => ({ label: value, value }));
  const tagsRef = React.useRef<Map<any, any>>(null);

  const ydoc = useSelector((store) =>
    selectYDocument(store, { id: document_id })
  );

  React.useEffect(() => {
    if (!ydoc) return;
    tagsRef.current = ydoc.getMap("tags") as any;

    function eventHandler(_, __, doc) {
      const tags = Array.from(tagsRef.current.keys());
      setTags(tags);
    }
    eventHandler(null, null, ydoc);

    ydoc.on("update", eventHandler);
    return () => {
      ydoc.off("update", eventHandler);
    };
  }, [ydoc]);

  function updateTags(new_tags) {
    const values = new_tags.map(({ value }) => value);

    const added = values.filter((value) => !tagsRef.current.has(value));

    const removed = Array.from(tagsRef.current.keys()).filter(
      (value) => !values.includes(value)
    );

    added.forEach((value) => {
      tagsRef && tagsRef.current.set(value, value);
    });
    removed.forEach((value) => {
      tagsRef && tagsRef.current.delete(value);
    });
  }
  return (
    <Creatable
      isLoading={loading}
      isMulti
      isSearchable
      value={values}
      options={data?.tags?.popular.map(({ tag }) => ({
        label: tag,
        value: tag,
      }))}
      onChange={updateTags}
    />
  );
}

export default SelectTags;
