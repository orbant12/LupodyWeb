
import '../../Css/file.css'

const FrameVideo = ({ videoSrc }) => {
    return videoSrc ? (
    <>
      <article className="grid">
        <div className="bord_g_2">
          <video crossOrigin="anonymous" autoPlay controls muted width="450" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
            
          <source src={videoSrc} type="video/mp4" crossOrigin="anonymous" />
          </video>
        </div>
      </article>
       </>
    ) : null;
  };
  
  export default FrameVideo;



  