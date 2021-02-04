import React, { useRef } from 'react';
import Rectangle from 'src/models/rectangle/Rectangle';
import { NO_FILE_ERROR_TEXT, EMPTY_FILE_ERROR_TEXT } from 'src/config';
import showError from 'src/utils/showError';
import readTextFileAsync from 'src/utils/promiseTextFileReader';
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

function parseRectangles(result: string) {
  if (!result) {
    throw new Error(EMPTY_FILE_ERROR_TEXT);
  }
  return JSON.parse(result).map(
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
}

async function readRectangles(
  event: React.ChangeEvent<HTMLInputElement>,
): Promise<Rectangle[]> {
  if (!event.target?.files?.length) {
    throw new Error(NO_FILE_ERROR_TEXT);
  }
  const fileResult = await readTextFileAsync(event.target.files[0]);
  return parseRectangles(fileResult);
}

interface RectanglesLoaderProps {
  onSuccess: OnSuccessCallback;
  onError: OnErrorCallback;
  onLoadingStart: () => void;
  disabled: boolean;
}

function RectanglesLoader(props: RectanglesLoaderProps): JSX.Element {
  const { disabled, onLoadingStart, onSuccess, onError } = props;
  const inputFileRef = useRef<HTMLInputElement>(null);

  const readFileAndResetInput = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      onLoadingStart();
      onSuccess(await readRectangles(e));
    } catch (error) {
      onError(error.message);
      showError(error.message);
    }
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
