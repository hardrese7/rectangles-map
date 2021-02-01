import React, { useRef } from 'react';
import RectangleSource from 'src/models/rectangle/RectangleSource';
import Rectangle from 'src/models/rectangle/Rectangle';
import { INVALID_JSON_ERROR_TEXT, NO_FILE_ERROR_TEXT } from 'src/utils/config';
import { showError } from 'src/utils/helpers';
import styles from './RectanglesLoader.module.css';

interface IRectanglesLoaderEvents {
  onSuccess: (data: Rectangle[]) => void;
  onError: (message: string) => void;
  onLoadingStart: () => void;
}

interface IRectanglesLoaderProps extends IRectanglesLoaderEvents {
  disabled: boolean;
}

function onReaderLoad(
  event: ProgressEvent<FileReader>,
  events: IRectanglesLoaderEvents,
) {
  let rectanglesSources: RectangleSource[] = [];
  const handleError = (message: string) => {
    events.onError(message);
    showError(message);
  };
  try {
    if (!event.target?.result) {
      throw new Error();
    }
    rectanglesSources = JSON.parse(event.target.result as string);
  } catch {
    handleError(INVALID_JSON_ERROR_TEXT);
  }

  try {
    const rectangles = rectanglesSources.map((rs) => new Rectangle(rs));
    events.onSuccess(rectangles);
  } catch (error) {
    handleError(error.message || error);
  }
}

function readFile(
  event: React.ChangeEvent<HTMLInputElement>,
  events: IRectanglesLoaderEvents,
) {
  const reader = new FileReader();
  reader.onload = (e) => onReaderLoad(e, events);
  if (!event.target?.files?.length) {
    showError(NO_FILE_ERROR_TEXT);
    events.onError(NO_FILE_ERROR_TEXT);
    return;
  }
  reader.readAsText(event.target.files[0]);
}

function RectanglesLoader({
  onLoadingStart,
  onError,
  onSuccess,
  disabled,
}: IRectanglesLoaderProps): JSX.Element {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const readFileAndResetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLoadingStart();
    readFile(e, { onSuccess, onError, onLoadingStart });
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const openFileDialog = () => inputFileRef.current?.click();
  return (
    <div className={styles.buttonsContainer}>
      <input
        onChange={readFileAndResetInput}
        type="file"
        ref={inputFileRef}
        hidden
      />
      <input
        disabled={disabled}
        onClick={openFileDialog}
        type="button"
        value="Load JSON"
      />
    </div>
  );
}

export default RectanglesLoader;
