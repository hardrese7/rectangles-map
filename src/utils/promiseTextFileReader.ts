export default function readTextFileAsync(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new TypeError('Argument must be a File or Blob'));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e?.target?.result || '';
      resolve(result as string);
    };
    reader.onerror = (e) => {
      reject(new Error(`Error reading ${file.name}: ${e?.target?.result}`));
    };
    reader.readAsText(file);
  });
}
