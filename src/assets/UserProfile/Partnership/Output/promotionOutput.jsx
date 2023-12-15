
import PictureOut from './pictureOut.jsx';
import VideoWideOut from './videoWideOut.jsx';
import VideoOut from './videoOut.jsx';
import DescriptionOut from './descriptionOut.jsx';


const PromotionOutput = ({
    picked,
    addedItemLinkFirst,
    addedItemNameFirst,
    addedItemPictureURLFirst
}) => {
    return(
        <div>
        {picked === 1 ?(
          <PictureOut addedItemLink={addedItemLinkFirst} addedItemName={addedItemNameFirst} addedItemPictureURL={addedItemPictureURLFirst} />
        ):picked === 2 ?(
          <VideoWideOut addedItemLink={addedItemLinkFirst} addedItemName={addedItemNameFirst} addedItemPictureURL={addedItemPictureURLFirst} />
        ):picked === 3 ?(
          <VideoOut addedItemLink={addedItemLinkFirst} addedItemPictureURL={addedItemPictureURLFirst} />
        ):picked === 4 ?(
          <DescriptionOut addedItemLink={addedItemLinkFirst} addedItemName={addedItemNameFirst} />
        ):null

        }
        </div>
    )
}

export default PromotionOutput