import { PathOrFileDescriptor, readFile, unlinkSync } from "fs";

const getDateString = () => {
  const date = new Date();

  const elements = [
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  ];

  return elements.map((e) => e.toString().padStart(2, "0")).join("");
};

export const uniqueFileName = (originalFileName: string) => {
  const [name, extension] = originalFileName.split(".");
  return `${name}_${getDateString()}.${extension}`;
};

export const deleteLocalFiles = (files: { path: string }[]) => files?.forEach((file) => unlinkSync(file.path));

export const getFileData = (filePath: PathOrFileDescriptor): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    readFile(filePath, (err, data) => (err ? reject(err) : resolve(data)));
  });
