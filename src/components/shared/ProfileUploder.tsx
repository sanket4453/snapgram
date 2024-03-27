import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

type FileUploderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const ProfileUploder = ({ fieldChange, mediaUrl }: FileUploderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-row bg-dark-3 w-28 h-7 lg:w-[200px] lg:h-48 rounded-full cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <>
          <div className="profile_uploader_circle">
            <img
              src="/assets/icons/file-upload.svg"
              width={25}
              height={25}
              alt="file-upload"
            />
            <h3 className="text-xs lg:text-sm text-light-2 mb-2 mt-2 ml-2">
              Drag photo here
            </h3>
            {/* <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p> */}
          </div>
          {/* <Button className="shad-button_dark_4">Select from computer</Button> */}
        </>
      )}
    </div>
  );
};

// 03:03

export default ProfileUploder;
