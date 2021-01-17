import React, { useRef } from 'react';
import ISourceRectangle from 'src/models/ISourceRectangle';
import styles from './LoaderJSON.module.css';

type OnSuccessCallback = (data: ISourceRectangle[]) => void;

interface ILoaderJSONEvents {
  onSuccess: OnSuccessCallback;
  onError: (error: string) => void;
  onLoadingStart: () => void;
}

interface ILoaderJSONProps extends ILoaderJSONEvents {
  disabled: boolean;
}

function onReaderLoad(
  event: ProgressEvent<FileReader>,
  events: ILoaderJSONEvents,
) {
  try {
    if (!event.target?.result) {
      throw new Error('Invalid JSON');
    }
    const rectangles = JSON.parse(event.target.result as string);
    // TODO check rectangles' array has the correct shape
    events.onSuccess(rectangles);
  } catch {
    const invalidJsonErrorText = 'Invalid JSON! Check the JSON format';
    // TODO implement the error handler
    // eslint-disable-next-line no-alert
    alert(invalidJsonErrorText);
    events.onError(invalidJsonErrorText);
  }
}

function readFile(
  event: React.ChangeEvent<HTMLInputElement>,
  events: ILoaderJSONEvents,
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

function LoaderJSON({
  onLoadingStart,
  onError,
  onSuccess,
  disabled,
}: ILoaderJSONProps): JSX.Element {
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

export default LoaderJSON;
