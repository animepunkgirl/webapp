import React from 'react';
import {Post, PostType} from "../../../types/feed.types";
import ComplexPost from "./ComplexPost/ComplexPost";
import Attachment from "./Attachment";

interface Props {
  post: Post
}

const Distributor = ({ post }: Props) => {
  if(post.type === PostType.Complex)
    return <ComplexPost attachments={post.attachments} />


  return <Attachment attachment={post.attachment} />
};

export default Distributor;