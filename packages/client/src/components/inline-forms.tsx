import { selectYDocument } from "ducks/appState/y-doc";
import styled from "@emotion/styled";
import React from "react";
import { useSelector } from "react-redux";
import Creatable from "react-select/creatable";
import { DocumentName } from "./document-name";

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;

  &.empty-row {
    padding: 0px 35px;
    width: 100%;
    background-color: tomato;
  }
`;

function EmptyRow() {
  return <Row className="empty-row">+</Row>;
}

function Tags({ tags, onChange }: { tags: string[]; onChange }) {
  const values = tags && tags.map((value) => ({ label: value, value }));

  return (
    <Creatable
      isMulti
      value={values}
      options={values || []}
      onChange={onChange}
    />
  );
}

export default function InlineForm({ document_id }) {
  const [tags, setTags] = React.useState(null);
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
    <List>
      <DocumentName document_id={document_id} />
      <Tags tags={tags} onChange={updateTags} />
    </List>
  );
}
