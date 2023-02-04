import React from 'react';
import {AttachmentType, TextAttachment, UnionAttachment} from "../../../../types/feed.types";
import ComplexAttachmentList from "./ComplexAttachmentList";
import Attachment from "../Attachment";
import FormattedText from "../FormattedText";

interface Props {
  attachments: UnionAttachment[]
}

const ComplexPost = ({ attachments: unsortedAttachments }: Props) => {
  const text = unsortedAttachments[0].type == AttachmentType.Text ? unsortedAttachments[0].text : null;
  // @ts-ignore
  const attachments: Exclude<UnionAttachment, TextAttachment>[] = unsortedAttachments[0].type === AttachmentType.Text ? unsortedAttachments.slice(1) : unsortedAttachments

  if(attachments.length === 1)
    return (
      <div>
        {text
          &&
          <FormattedText
            className='px-2 pb-1 text-sm whitespace-pre-line break-words'
            text={text}
          />
        }
        <Attachment attachment={attachments[0]} />
      </div>
  )

  return (
    <div>
      {text && <FormattedText
        className='px-2 pb-1 text-sm whitespace-pre-line break-words'
        text={text}
      />}
      <ComplexAttachmentList attachments={attachments} />
    </div>
  );
};

export default ComplexPost;