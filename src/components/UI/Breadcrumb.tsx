import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { cardState, directoryState } from "@/atoms/state";

export default function Breadcrumb() {
  const router = useRouter();
  const [dropDown, setDropDown] = useState(false);
  const [card, setCard] = useRecoilState(cardState);
  const [directory, setDirectory] = useRecoilState(directoryState);

  // Display only the last 4 directories
  const displayedDirectories = directory.slice(-2);

  return (
    <nav className="flex justify-between mr-0 md:mr-36" aria-label="Breadcrumb">
      <ol className="inline-flex items-center mb-0">
      {directory.length <= 2 && (
          <li key={-2}>
            <button
              className="text-white font-medium  px-2 hover:text-amber-500"
              onClick={() => {
                router.push("/");
              }}
              type="button"
            >
              Home
            </button>
            <span className="mx-2 text-gray-400">/</span>
          </li>
        )}
        {directory.length > 2 && (
          <li key={-1}>
            <button
              className="text-white font-medium  px-2 hover:text-amber-500"
              onClick={() => {
                setDirectory(prevDirectory => prevDirectory.slice(0, -1));
              }}
              type="button"
            >
              ...
            </button>
            <span className="mx-2 text-gray-400">/</span>
          </li>
        )}
        {displayedDirectories.map((dir, index) => (
            <li aria-current="page" className="relative items-center" key={index}>
              <div className="flex items-center">
                {index === displayedDirectories.length - 1 ? (
                  <button
                    className="text-white font-medium inline-flex items-center px-2 hover:text-amber-500"
                    onClick={() => {
                      setDropDown(!dropDown);
                    }}
                  >
                    {dir.name}
                    {index === displayedDirectories.length - 1 && (
                      <svg
                        className="w-2.5 h-2.5 ms-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    )}
                  </button>
                ) : (
                  <span>
                    <span className="text-white font-medium px-2">{dir.name}</span>
                    <span className="mx-2 text-gray-400">/</span>
                  </span>
                )}
                {dropDown && index === displayedDirectories.length - 1 && (
                  <div
                    style={{ backgroundColor: "#2D4A53" }}
                    id="dropdown-database"
                    className="z-10 mt-40 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-32 dark:bg-gray-700"
                  >
                    <ul className="py-2 text-sm text-white dark:text-white">
                      <li key={"create folder"}>
                        <button
                          className="px-4 py-2 dark:hover:text-gray-300"
                          onClick={() => {
                            setCard({ name: "CreateFolder", shown: true, folderId: null, filekey: "", newName: null, url: null });
                            setDropDown(false);
                          }}
                        >
                          Create Folder
                        </button>
                      </li>
                      <li key={"upload file"}>
                        <button
                          className="px-4 py-2 dark:hover:text-gray-300"
                          onClick={() => {
                            setCard({ name: "UploadFile", shown: true, folderId: null, filekey: "", newName: null, url: null });
                            setDropDown(false);
                          }}
                        >
                          Upload File
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>
        ))}
      </ol>
    </nav>
  );
}