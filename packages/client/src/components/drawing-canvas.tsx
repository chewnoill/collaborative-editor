import React, { useEffect } from "react";
import * as Y from "yjs";
import d3 from "d3";
import useYDoc from "hooks/use-y-doc";

const getInsertedItems = (type, event) => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (event.adds(n)) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          cs.push(c[i]);
        }
      }
    }
    n = n.right;
  }
  return cs;
};

const getDeletedItems = (type, event) => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (event.deletes(n)) {
      if (n.countable && n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          cs.push(c[i]);
        }
      }
    }
    n = n.right;
  }
  return cs;
};

const lines = new Map();

let svg;

function DrawingCanvas({ document_id, name }) {
  const { data, error, isLoading, isError } = useYDoc(document_id);

  if (isError) {
    console.error(error.message);
  }

  const renderPath = d3.svg
    .line()
    .x((d) => {
      return d[0];
    })
    .y((d) => {
      return d[1];
    })
    .interpolate("basis");

  // create line from a shared array object and update the line when the array changes
  const drawLine = (yarray) => {
    const line = svg.append("path").datum(yarray.toArray());
    line.attr("d", renderPath);
    line.attr("fill", "transparent");
    line.attr("style", "stroke:black;stroke-width:1");
    lines.set(yarray, line);
    yarray.observe((event) => {
      const newItems = getInsertedItems(yarray, event);
      // we only implement insert events that are appended to the end of the array
      newItems.forEach((value) => {
        line.datum().push(value);
      });
      line.attr("d", renderPath);
    });
  };

  let sharedLine = null;
  const dragStart = (drawing) => {
    sharedLine = new Y.Array();
    drawing.insert(drawing.length, [sharedLine]);
  };

  // After one dragged event is recognized, we ignore them for 33ms.
  let ignoreDrag = null;
  function drag() {
    if (sharedLine != null && ignoreDrag == null) {
      ignoreDrag = setTimeout(() => {
        ignoreDrag = null;
      }, 33);
      const coords = d3.mouse(this);
      sharedLine.push([coords]);
    }
  }

  const dragEnd = () => {
    sharedLine = null;
    clearTimeout(ignoreDrag);
    ignoreDrag = null;
  };

  // WIP
  const undoManager = (ydoc) => {
    const drawing = data.ydoc.getArray("drawing");
    const item = drawing.get(drawing.length - 1)["_item"];
    if (drawing.length > 0 && item.id.client === ydoc.clientID) {
      drawing.delete(drawing.length - 1, 1);
    }
  };

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    data.wsProvider.on("status", (event) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });
    data.rtcProvider.awareness.setLocalStateField("user", {
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      name,
    });
    svg = d3.select("#drawingCanvas");
    const drawing = data.ydoc.getArray("drawing");

    svg.call(
      d3.behavior
        .drag()
        .on("dragstart", () => dragStart(drawing))
        .on("drag", drag)
        .on("dragend", dragEnd)
    );

    // call drawLine every time an array is appended
    drawing.observe((event) => {
      const newItems = getInsertedItems(drawing, event);
      newItems.forEach(drawLine);

      const deletedItems = getDeletedItems(drawing, event);
      deletedItems.forEach((item) => {
        const line = lines.get(item);
        if (line) {
          line.remove();
          lines.delete(item);
        }
      });
    });
    // draw all existing content
    for (let i = 0; i < drawing.length; i++) {
      drawLine(drawing.get(i));
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error connecting to collab service</div>;
  } else {
    return (
      <div>
        <button onClick={() => undoManager(data.ydoc)}>Undo</button>
        <svg id="drawingCanvas" viewBox="0 0 200 200" width="100%"></svg>
      </div>
    );
  }
}

export default DrawingCanvas;
