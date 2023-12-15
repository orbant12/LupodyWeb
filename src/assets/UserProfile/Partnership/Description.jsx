const PartnershipDesc = ({
    compAddedItemName1,
    compAddedItemLink1

}) => {

    const handleInputItemNameFirst = (e) => {
       compAddedItemName1(e.target.value)
    }

    const handleInputLinkFirst = (e) => {
        compAddedItemLink1(e.target.value)
    }

    return (
  
     
        <div style={{display:"flex",flexDirection:"row",width:"100%",justifyContent:"space-evenly",alignContent:"center",marginTop:30}}>

      {/*NAME*/}
        <div>
          <div style={{marginTop:10}}>
          
            <h6 style={{opacity:0.6}}>Infromation You Want To Show The User</h6>
            <h3>Description</h3>
          </div>
          <textarea placeholder="Write Your Information here.." style={{width:500,height:130,marginTop:10}} onChange={handleInputItemNameFirst} ></textarea>
        </div>
        <hr />
           {/*LINK*/}  
           <div>
          <div>
      
            <h6 style={{opacity:0.6}}>Add Link To The Item</h6>
            <h3>Item Link</h3>
          </div>
          <input type="text" onChange={handleInputLinkFirst} />
        </div>

        </div>
    
 
    )
}

export default PartnershipDesc