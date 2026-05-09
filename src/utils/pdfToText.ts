import pdf from "pdf-parse";

export const pdfToText = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const data = await pdf(Buffer.from(buffer));
  return data.text;
};