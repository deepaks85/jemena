import React, { useState } from "react";
import { Image } from "react-bootstrap";
import defaultAvatar from "../assets/user.png";

export default function Avatar({
  src = defaultAvatar,
  size = 36,
  alt = "User",
}) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      roundedCircle
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      onError={() => setImgSrc(defaultAvatar)}
      style={{ objectFit: "cover" }}
    />
  );
}
