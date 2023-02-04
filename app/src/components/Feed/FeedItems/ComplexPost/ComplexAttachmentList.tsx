import React, {CSSProperties} from 'react';
import {AttachmentType, TextAttachment, UnionAttachment} from "../../../../types/feed.types";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper";
import Attachment, {getAttachmentRenderKey} from "../Attachment";

interface Props {
  attachments: Exclude<UnionAttachment, TextAttachment>[]
}

const ComplexAttachmentList = ({ attachments }: Props) => {

  return (
    <Swiper
      pagination={{
        type: "fraction",
      }}
      autoHeight
      navigation
      className='post-swiper'
      modules={[Navigation, Pagination]}
    >
      {attachments.map(attachment =>
        <SwiperSlide key={getAttachmentRenderKey(attachment)}>
          <Attachment attachment={attachment} />
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default ComplexAttachmentList;