interface AssignImageAttributesProps {
  imageAttributes: {
    src: string;
    format: string;
    width: number;
    height: number;
  };
  imageElement: HTMLImageElement;
}

const assignImageAttributes = ({
  imageAttributes,
  imageElement
}: AssignImageAttributesProps) => {
  Object.assign(imageElement, {
    src: imageAttributes.src,
    width: imageAttributes.width,
    height: imageAttributes.height,
  });
  imageElement.setAttribute("format", imageAttributes.format);
};

export default assignImageAttributes