
import '../../Css/file.css'

const FrameVideoFYP = ({ videoSrc }) => {
    return videoSrc ? (
    <>
      <article className="grid">
        <div className="bord_g_2">
          <video crossOrigin="anonymous" autoPlay controls muted className='fyp-video-frame' >
            
          <source src={videoSrc} type="video/mp4" crossOrigin="anonymous" />
          </video>
        </div>
      </article>
       </>
    ) : null;
  };
  
  export default FrameVideoFYP;



  