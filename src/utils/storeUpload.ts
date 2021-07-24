import { createWriteStream, unlink } from "fs";
import { nanoid } from "nanoid";
export default async function storeUpload(upload: any) {
  const { createReadStream, filename } = await upload;
  const stream = createReadStream();
  const storedFileName = `${nanoid()}-${filename}`;

  await new Promise((resolve, reject) => {
    const writeStream = createWriteStream(`public/img/${storedFileName}`);

    writeStream.on("finish", resolve);
    writeStream.on("error", (error) => {
      unlink(`public/img/${storedFileName}`, () => {
        reject(error);
      });
    });

    stream.on("error", (error) => writeStream.destroy(error));
    stream.pipe(writeStream);
  });
  return storedFileName;
}
