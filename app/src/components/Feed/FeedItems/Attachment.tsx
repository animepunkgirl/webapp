import React from 'react';
import {AttachmentType, UnionAttachment} from "../../../types/feed.types";
import VideoPlayer from "./VideoPlayer";
import FormattedText from "./FormattedText";

interface Props {
  attachment: UnionAttachment
}

const Attachment = ({ attachment }: Props) => {
  if(attachment.type === AttachmentType.Image)
    return <img src={attachment.image_url} />

  if(attachment.type === AttachmentType.Video) {
    return <VideoPlayer attachment={attachment} />
  }

  if(attachment.type === AttachmentType.File)
    return <p>File: {attachment.file_url}</p>

  return <FormattedText className='whitespace-pre-line break-words px-3 pb-3' text={attachment.text} />;
};

export const getAttachmentRenderKey = (attachment: UnionAttachment) => {
  if(attachment.type === AttachmentType.Image)
    return attachment.image_url

  if(attachment.type === AttachmentType.Video)
    return attachment.player_url

  if(attachment.type === AttachmentType.File)
    return attachment.file_url

  return attachment.text
}

export default Attachment;