import React, { useRef } from 'react';
import Rectangle from 'src/models/rectangle/Rectangle';
import { INVALID_JSON_ERROR_TEXT, NO_FILE_ERROR_TEXT } from 'src/config';
import showError from 'src/utils/showError';
import styles from './RectanglesLoader.module.css';

type OnSuccessCallback = (data: Rectangle[]) => void;
type OnErrorCallback = (message: string) => void;
interface RectangleSource {
  yaw_angle: number;
  color: string;
  center_lat: number;
  center_lng: number;
  length: number;
  width: number;
}

function loadRectangles(
  event: ProgressEvent<FileReader>,
  onSuccess: OnSuccessCallback,
  onError: OnErrorCallback,
) {
  const handleError = (message: string) => {
    onError(message);
    showError(message);
  };
  try {
    if (!event.target?.result) {
      throw new Error();
    }
    const rectangles = JSON.parse(event.target.result as string).map(
      (r: RectangleSource) =>
        new Rectangle(
          r.yaw_angle,
          r.color,
          r.center_lat,
          r.center_lng,
          r.length,
          r.width,
        ),
    );
    onSuccess(rectangles);
  } catch {
    // TODO handle typeerrors
    // handleError(error.message || error);
    handleError(INVALID_JSON_ERROR_TEXT);
  }
}

function readFile(
  event: React.ChangeEvent<HTMLInputElement>,
  onSuccess: OnSuccessCallback,
  onError: OnErrorCallback,
) {
  const reader = new FileReader();
  reader.onload = (e) => loadRectangles(e, onSuccess, onError);
  // todo check onloadend
  // todo check onerror
  if (!event.target?.files?.length) {
    showError(NO_FILE_ERROR_TEXT);
    onError(NO_FILE_ERROR_TEXT);
    return;
  }
  reader.readAsText(event.target.files[0]);
}

interface RectanglesLoaderProps {
  onSuccess: OnSuccessCallback;
  onError: OnErrorCallback;
  onLoadingStart: () => void;
  disabled: boolean;
}

function RectanglesLoader(props: RectanglesLoaderProps): JSX.Element {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const readFileAndResetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onLoadingStart();
    readFile(e, props.onSuccess, props.onError);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const { disabled } = props;
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
