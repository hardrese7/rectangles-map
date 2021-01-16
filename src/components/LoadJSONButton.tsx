import React, { useRef } from 'react';
import ISourceRectangle from '../models/ISourceRectangle'; // TODO implement absolute imports

type OnJSONLoadCallback = (data: ISourceRectangle[]) => void;

interface ILoadJSONButtonProps {
  onJSONLoad: OnJSONLoadCallback;
}

function onReaderLoad(
  event: ProgressEvent<FileReader>,
  onJSONLoad: OnJSONLoadCallback,
) {
  try {
    if (!event.target?.result) {
      throw new Error('Invalid JSON');
    }
    const rectangles = JSON.parse(event.target.result as string);
    // TODO check rectangles' array has the correct shape
    onJSONLoad(rectangles);
  } catch {
    // TODO implement the error handler
    // eslint-disable-next-line no-alert
    alert('Invalid JSON! Check the JSON format');
  }
}

function readFile(
  event: React.ChangeEvent<HTMLInputElement>,
  onJSONLoad: OnJSONLoadCallback,
) {
  const reader = new FileReader();
  reader.onload = (e) => onReaderLoad(e, onJSONLoad);
  if (!event.target?.files?.length) {
    // eslint-disable-next-line no-alert
    alert('You should to choose one correct JSON file');
    return;
  }
  reader.readAsText(event.target.files[0]);
}

function LoadJSONButton({ onJSONLoad }: ILoadJSONButtonProps): JSX.Element {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const readFileAndResetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    readFile(e, onJSONLoad);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const openFileDialog = () => inputFileRef.current?.click();
  // TODO get rid of inline styles
  return (
    <div style={{ position: 'fixed' }}>
      <input
        onChange={readFileAndResetInput}
        type="file"
        ref={inputFileRef}
        hidden
      />
      <input onClick={openFileDialog} type="button" value="Load JSON" />
    </div>
  );
}

export default LoadJSONButton;
