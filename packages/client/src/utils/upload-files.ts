
export async function uploadFilesToYDoc(ydoc, files, { insertPos, uploadFn }: { insertPos?: number, uploadFn: any}) {
  const yText = ydoc.getText("codemirror");
  const uploads = await Promise.all(Array.from(files).map(uploadFn));

  const defaultInsertPos = yText.toString().length - 1;

  uploads.forEach(({ id, name, mime_type }) =>
    yText.insert(
      insertPos === undefined ? defaultInsertPos : insertPos,
      `<Img id="${id}"\n     mime_type="${mime_type}"\n     name="${name}"/>\n`
    )
  );
}
