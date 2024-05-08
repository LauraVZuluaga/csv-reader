import { useState } from "react";
import { Toaster, toast } from "sonner";
import { type Data } from "./types";
import "./App.css";
import { uploadFile } from "./services/upload";
import { Search } from "./steps/Search";

const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  UPLOADING: "uploading",
  READY_UPLOAD: "ready_upload",
  READY_USAGE: "ready_usage",
} as const;

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "Subir archivo",
  [APP_STATUS.UPLOADING]: "Subiendo...",
};

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Data>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];

    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (appStatus != APP_STATUS.READY_UPLOAD || !file) {
      return;
    }
    setAppStatus(APP_STATUS.UPLOADING);

    const [error, newData] = await uploadFile(file);
    console.log({ newData });

    if (error) {
      setAppStatus(APP_STATUS.ERROR);
      toast.error(error.message);
      return;
    }
    setAppStatus(APP_STATUS.READY_USAGE);
    if (newData) setData(newData);
    toast.success("Archivo subido correctamente");
  };

  const showButton =
    appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;
  const showInput = appStatus != APP_STATUS.READY_USAGE;

  return (
    <>
      {/* <Toaster/> */}
      <h4>Challenge: Upload CSV + Search</h4>
      {showInput && (
        <form onSubmit={handleSubmit}>
          <label>
            <input
              disabled={appStatus === APP_STATUS.UPLOADING}
              name="file"
              type="file"
              accept=".csv"
              onChange={handleInputChange}
            />
          </label>
          {showButton && (
            <button disabled={appStatus === APP_STATUS.UPLOADING}>
              {BUTTON_TEXT[appStatus]}
            </button>
          )}
        </form>
      )}

      {appStatus === APP_STATUS.READY_USAGE && (
        <Search initialData={data}> </Search>
      )}
    </>
  );
}

export default App;
