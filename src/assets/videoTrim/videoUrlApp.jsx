
import { useState} from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg/src/index.js"
import * as helpers from "./utils/helpers";
import VideoUrlPicker from "./videoUrlPicker";
import OutputVideo from "./videoPlayer";
import RangeInput from "./videoRangeInput";
import './global.css'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import OutputVideo2 from "./outputNoDown"



const FF = createFFmpeg({
  log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
});

  (async function () {
    await FF.load();
  })();
  

function VideoUrlApp({setCreateBtn, fileImage,setPassedDataUrl,setExtractMeta,setPassedAudioDataUrl,subscriptionState,UrlFromOutSide}) {

const [inputVideoFile, setInputVideoFile] = useState(null);
const [trimmedVideoFile, setTrimmedVideoFile] = useState(null);
const [trimIsProcessing, setTrimIsProcessing] = useState(false);
const [videoMeta, setVideoMeta] = useState(null);
const [URL, setURL] = useState(null);
const [rStart, setRstart] = useState(0); // 0%
const [rEnd, setRend] = useState(10); // 10%
const [thumbnails, setThumbnails] = useState([]);
const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);

const [show,setShow]=useState(true)
const [showBtn,setShowBtn]=useState(true)
const [saveBtn,setSaveBtn]=useState(true)
const [videoAppShow,setVideoAppShow]=useState(true)
const [addedShow,setAddedShow]=useState(true)
const [deletedState,setDeletedState]=useState(true)
const [backState,setBackState]=useState(false)
const [loadingText, setLoadingText] = useState("Loading...");
const [isEditing, setIsEditing] = useState(false);
const [clipTitle, setClipTitle] = useState('Your Clip Title');


const handleVideoFileChange = async (videoFile) => {
  setInputVideoFile(videoFile);
  setDeletedState(true);
  
  console.log(videoFile);
  setURL(await helpers.readFileAsBase64(videoFile));
};

const handleUpdateRange = (func) => {
  return ({ target: { value } }) => {
    func(value);
  };
};
  
const getThumbnails = async ({ duration }) => {
  if (!FF.isLoaded()) await FF.load();
  setThumbnailIsProcessing(true);
  setShowBtn(false);
  let MAX_NUMBER_OF_IMAGES = 15;
  let offset =
  duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / MAX_NUMBER_OF_IMAGES;
  let NUMBER_OF_IMAGES = duration < MAX_NUMBER_OF_IMAGES ? duration : 15;
  FF.FS("writeFile", inputVideoFile.name, await fetchFile(inputVideoFile));
  const arrayOfImageURIs = [];

  for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
    let startTimeInSecs = helpers.toTimeString(Math.round(i * offset));
    if (startTimeInSecs + offset > duration && offset > 1) {
      offset = 0;
    }
    try {
      console.log(`Generating frame ${i}`);
      await FF.run(
            "-ss",
            startTimeInSecs,
            "-i",
            inputVideoFile.name,
            "-t",
            "00:00:1.000",
            "-vf",
            "scale=150:-1",
            `img${i}.png`
      );
      const data = FF.FS("readFile", `img${i}.png`);
      let blob = new Blob([data.buffer], { type: "image/png" });
      let dataURI = await helpers.readFileAsBase64(blob);
      arrayOfImageURIs.push(dataURI);
      FF.FS("unlink", `img${i}.png`);
    } catch (error) {
      console.error(`Error generating frame ${i}:`, error);
    }
  }

  getFirstFrameImageURL();
  setThumbnailIsProcessing(false);
  return arrayOfImageURIs;
};

const getFirstFrameImageURL = async () => {
  if (!FF.isLoaded()) await FF.load();
  const startTimeInSecs = "00:00:00.005"; // You may need to adjust this time offset.
  FF.FS("writeFile", inputVideoFile.name, await fetchFile(inputVideoFile));
  try {
    console.log(`Generating the first frame`);
    await FF.run(
          "-ss",
          startTimeInSecs,
          "-i",
          inputVideoFile.name,
          "-t",
          "00:00:1.000",
          "-vf",
          "scale=150:-1",
          "firstFrame.png"
    );
    const data = FF.FS("readFile", "firstFrame.png");
    let blob = new Blob([data.buffer], { type: "image/png" });
    // Convert the Blob to a data URL
    const dataURI = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    FF.FS("unlink", "firstFrame.png");
    console.log(dataURI)
    fileImage(dataURI)
    return dataURI;
  } catch (error) {
    console.error(`Error generating the first frame:`, error);
    return null; // Handle the error gracefully
  }
};
    
const handleLoadedData = async (e) => {
  const el = e.target;
  const meta = {
    name: inputVideoFile.name,
    duration: el.duration,
    videoWidth: el.videoWidth,
    videoHeight: el.videoHeight,
  };

  console.log({ meta });
  setVideoMeta(meta);
  const thumbnails = await getThumbnails(meta);
  setThumbnails(thumbnails);
};

const toggleVideoApp = async () => {
  setVideoAppShow(false);
  setSaveBtn(true);
  setAddedShow(false);
  setCreateBtn(true);
};

const deleteAction = async () => {
  setVideoAppShow(true);
  setShow(true)
  setAddedShow(true);
  setInputVideoFile(null);
  setDeletedState(false);
  setTrimmedVideoFile(null);
  setCreateBtn(false);

  setBackState(false)  
};

const handleAudioTrim = async () => {
  let startTime = ((rStart / 100) * videoMeta.duration).toFixed(2);
  let offset = ((rEnd / 100) * videoMeta.duration - startTime).toFixed(2);
  try {
    FF.FS("writeFile", inputVideoFile.name, await fetchFile(inputVideoFile));
    await FF.run(
          "-ss",
          helpers.toTimeString(startTime),
          "-i",
          inputVideoFile.name,
          "-map",
          "0:a:0", // Select the first audio stream
          "-vn", 
          "-t",
          helpers.toTimeString(offset),
          "-acodec",
          "libmp3lame",
          "audio.mp3"
    );
    const data = FF.FS("readFile", "audio.mp3");
    console.log(data);
    setPassedAudioDataUrl(data)
  } catch (error) {
    console.log(error);
  } 
};

const setVideoSize = async (data) => {
  const videoSizeInBytes = new Blob([data.buffer], { type: "video/mp4" }).size;
  const videoNameFile = inputVideoFile.name
  const startTime = ((rStart / 100) * videoMeta.duration).toFixed(2);
  const offset = ((rEnd / 100) * videoMeta.duration - startTime).toFixed(2);
  //Meta Data
  const extractedMeta = {
    videoName: videoNameFile,
    videoDuration: (offset / 60).toFixed(0),
    videoDurationString: helpers.toTimeString(offset),
    videoSize: videoSizeInBytes ,
  }
  console.log(extractedMeta)
  setExtractMeta(extractedMeta)
};

const handleTrim = async () => {
  let startTime = ((rStart / 100) * videoMeta.duration).toFixed(2);
  let offset = ((rEnd / 100) * videoMeta.duration - startTime).toFixed(2);
  const offsetLenght = (offset / 60).toFixed(0);

  if(10 > offset > 5){
    setLoadingText(`Your Video is ${(offset / 60).toFixed(0)} Minutes => Process Time May Take About 30 secounds`)
  }else if (offset > 10){
    setLoadingText(`Your Video is ${(offset / 60).toFixed(0)} Minutes => Process Time May Take About 45 secounds`)
  }else if (offset < 5){
    setLoadingText(`Your Video is ${(offset / 60).toFixed(0)} Minutes => Process Time May Take About 15 secounds`)
  }else{
    setLoadingText(`Loading...`)
  }

  if(subscriptionState == true){
    setTrimIsProcessing(true);
    setShow(false);
    if(deletedState == false){
      setDeletedState(!deletedState)
    }
    setShowBtn(true);
    setSaveBtn(false);
    try {
      FF.FS("writeFile", inputVideoFile.name, await fetchFile(inputVideoFile));
      await FF.run(
            "-ss",
            helpers.toTimeString(startTime),
            "-i",
            inputVideoFile.name,
            "-t",
            helpers.toTimeString(offset),
            "-c:v",
            "copy",
            "ping.mp4"
      );
      const data = FF.FS("readFile", "ping.mp4");
      console.log(data);
      //SIZE
      await setVideoSize(data);
      //DATA URL
      const dataURL = await helpers.readFileAsBase64(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      //EXTRACT AUDIO
      await handleAudioTrim()
      //DATA URL TO VARIABLE
      setPassedDataUrl(dataURL)
      //DATA URL EXTRACT
      setTrimmedVideoFile(dataURL);
   
    } catch (error) {
      onsole.log(error);
    } finally {
      setTrimIsProcessing(false);
    }
  }else if (subscriptionState == false && offsetLenght < 10) {
    setTrimIsProcessing(true);
    setShow(false);
    if(deletedState == false){
      setDeletedState(!deletedState)
    }
    setShowBtn(true);
    setSaveBtn(false);
    try {
      FF.FS("writeFile", inputVideoFile.name, await fetchFile(inputVideoFile));
      await FF.run(
            "-ss",
            helpers.toTimeString(startTime),
            "-i",
            inputVideoFile.name,
            "-t",
            helpers.toTimeString(offset),
            "-c:v",
            "copy",
            "ping.mp4"
      );
      const data = FF.FS("readFile", "ping.mp4");
      console.log(data);
      //SIZE
      await setVideoSize(data);
      //DATA URL
      const dataURL = await helpers.readFileAsBase64(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      //EXTRACT AUDIO
      await handleAudioTrim()
      //DATA URL TO VARIABLE
      setPassedDataUrl(dataURL)
      //DATA URL EXTRACT
      setTrimmedVideoFile(dataURL);
  
    } catch (error) {
      console.log(error);
    } finally {
      setTrimIsProcessing(false);
    }
  }else{
    alert("Please Subscribe to Trim Videos Longer Than 10 Minutes")
  }
};

const handleEditClick = () => {
  setIsEditing(true);
};

const handleTitleChange = (event) => {
  setClipTitle(event.target.value);
};
  
const handleTitleSave = () => {
  setIsEditing(false);
  // You can save the edited title here, e.g., by making an API request.
};
    
const HandleBack = () => {
  setShow(!show)
  setDeletedState(!deletedState)
  setBackState(true)
};


return (
<>
{videoAppShow?
  <main className="App">
    {<div className="range-picker">
      {deletedState?
        <RangeInput
          rEnd={rEnd}
          rStart={rStart}
          handleUpdaterStart={handleUpdateRange(setRstart)}
          handleUpdaterEnd={handleUpdateRange(setRend)}
          loading={thumbnailIsProcessing}
          videoMeta={videoMeta}
          thumbNails={thumbnails}
         
        />:null
      }

      {backState?
        <RangeInput
          rEnd={rEnd}
          rStart={rStart}
          handleUpdaterStart={handleUpdateRange(setRstart)}
          handleUpdaterEnd={handleUpdateRange(setRend)}
          loading={thumbnailIsProcessing}
          videoMeta={videoMeta}
          thumbNails={thumbnails}
          
        />:null
      }
      
    </div>}
      
    
    <section className="deck">
      <article className="grid_txt_2">
        {trimIsProcessing ? <h4>{loadingText}</h4>: null}
          {show?
            <VideoUrlPicker
              showVideo={!!inputVideoFile} 
              handleChange={handleVideoFileChange}
              outSideUrl={UrlFromOutSide}
            >
            <div className="bord_g_2 p_2">
              <video
                src={inputVideoFile ? URL : null}
                autoPlay
                controls
                muted
                onLoadedMetadata={handleLoadedData}
                width="450"
                style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
              ></video>
            </div>
            </VideoUrlPicker>:null
          }    
      </article>
      {deletedState?
        <OutputVideo
          videoSrc={trimmedVideoFile}
          style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
        />:null
      }
    </section>
  </main>:null}
  {!showBtn?
    <div className="btn-container">
      <div
        onClick={handleTrim}
        className="btn2 btn_b2"
        disabled={trimIsProcessing}
        style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
      >
        {trimIsProcessing ? "Loading..." : "Clip"}
        {thumbnailIsProcessing ? " Loading...":""}
      </div>
    </div>:null
  }

  {!saveBtn?
    <div className="btn-container">
      <div
        onClick={toggleVideoApp}
        className="btn2 btn_b2"
        disabled={trimIsProcessing}
      >
        {trimIsProcessing ? "loading..." : "Save"}
      </div>
      <div className="back-btn">
        <div className="back-btn-txt" onClick={HandleBack}>
          <h3>Back</h3>
        </div>
      </div>
    </div>:null
  }

  {!addedShow?
    <div className="added">
      <OutputVideo2  videoSrc={trimmedVideoFile}
            style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} />
      <HighlightOffIcon className="added-delete-btn" onClick={deleteAction}/>
      <div className="added-video-desc">
        {isEditing ? (
          <div className="change-container">
            <input
              className="custom-video-input"
              type="text"
              value={clipTitle}
              onChange={handleTitleChange}
            />
            <div className="custom-video-title-btn" onClick={handleTitleSave}>Save</div>
          </div>
        ) : (
          <div className="edit-row-video-title">
            <h4>{clipTitle}</h4>
            <EditIcon className="added-edit-btn" onClick={handleEditClick} />
          </div>
        )}
      </div>
       
    </div>:null        
  }
</>
);
}
export default VideoUrlApp
  


