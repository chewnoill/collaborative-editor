import { gql, useMutation } from "@apollo/client";
import axios from "axios";

export function useFileUpload() {
  const [mutate] = useMutation(gql`
    mutation UploadData($file_name: String!, $mime_type: String!, $size: Int!) {
      uploadData(
        args: { file_name: $file_name, size: $size, mime_type: $mime_type }
      ) {
        id
        upload_url
      }
    }
  `);

  return async function uploadFile(file: File) {
    const { data } = await mutate({
      variables: {
        file_name: file.name,
        mime_type: file.type,
        size: file.size,
      },
    });
    const { id, upload_url } = data.uploadData;

    // formData.append("file", file);
    const result = await axios.put(upload_url, file, {
      headers: {
        "content-type": file.type,
        "content-length": file.size,
      },
    });
    return { id, name: file.name, mime_type: file.type };
  };
}
