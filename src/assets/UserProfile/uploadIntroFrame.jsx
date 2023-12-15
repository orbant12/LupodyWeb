function IntroVideo({ showVideo, handleChange, children }) {

  const FileInput = () => (
    <label
      htmlFor="y"
      id={`${showVideo ? "file_picker_small" : ""}`}
      className={`file_picker `}
      style={{width:150,height:100,marginTop:10}}
    >
      <span style={{opacity:0.3,fontSize:10}}>choose file</span>
      <input onChange={handleChange} style={{display:"none"}} type="file" id="y" accept="video/mp4" />
    </label>
  );
  
  
  return showVideo ? (
    <>
      {" "}
      {children} 
    </>
    ) : (
      <FileInput />
    )
  }
  
  export default IntroVideo;
  