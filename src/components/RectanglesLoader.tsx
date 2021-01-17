import React, { useRef } from 'react';
import ISourceRectangle from 'src/models/ISourceRectangle';
import Rectangle from 'src/models/Rectangle';
import styles from './RectanglesLoader.module.css';

type OnSuccessCallback = (data: Rectangle[]) => void;

interface IRectanglesLoaderEvents {
  onSuccess: OnSuccessCallback;
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
  let sourceRectangles: ISourceRectangle[] = [];
  const handleError = (message: string) => {
    events.onError(message);
    // eslint-disable-next-line no-alert
    alert(message);
  };
  try {
    if (!event.target?.result) {
      throw new Error();
    }
    sourceRectangles = JSON.parse(event.target.result as string);
  } catch {
    const invalidJsonErrorText = 'Invalid JSON! Check the JSON format';
    handleError(invalidJsonErrorText);
  }

  try {
    const rectangles = sourceRectangles.map((sr) => new Rectangle(sr));
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
    const noFileErrorText = 'You should to choose one correct JSON file';
    // eslint-disable-next-line no-alert
    alert(noFileErrorText);
    events.onError(noFileErrorText);
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
