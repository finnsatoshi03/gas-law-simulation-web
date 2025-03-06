import React, { useState } from "react";
import {
  Atom,
  Info,
  Expand,
  Minimize,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { useWalkthrough } from "@/contexts/WalkthroughProvider";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export interface ProponentDetails {
  name: string;
  birthYear: number;
  deathYear: number;
  description: string;
  image: string;
  contribution?: string;
}

export interface InfoSheetProps {
  title: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  proponents?: ProponentDetails[];
  sections: {
    title?: string;
    type?: "paragraph" | "list";
    content: string | string[];
  }[];
  examples?: {
    title?: string;
    description: string[];
    images: string[];
  }[];
  className?: string;
}

const ProponentCard: React.FC<{
  details: ProponentDetails;
  fontSize: number;
}> = ({ details, fontSize }) => {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const imageSize = Math.max(80, fontSize * 4);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 flex flex-wrap gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="relative flex-shrink-0 cursor-pointer"
            style={{
              width: `${imageSize}px`,
              height: `${imageSize}px`,
            }}
            onClick={() => setIsImagePreviewOpen(true)}
          >
            <img
              src={details.image}
              alt={details.name}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>Click to view full image</TooltipContent>
      </Tooltip>

      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-4xl w-full">
          <div className="relative">
            <img
              src={details.image}
              alt={`Full image of ${details.name}`}
              className="w-full max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <h3
            style={{ fontSize: `${fontSize * 1.125}px` }}
            className="font-bold text-gray-900"
          >
            {details.name}
          </h3>
          <span
            style={{ fontSize: `${fontSize * 0.875}px` }}
            className="text-gray-600"
          >
            {details.birthYear} - {details.deathYear}
          </span>
        </div>
        <p
          style={{ fontSize: `${fontSize}px` }}
          className="text-gray-700 mt-1 leading-relaxed"
        >
          {details.description}
        </p>
        {details.contribution && (
          <p
            style={{ fontSize: `${fontSize}px` }}
            className="mt-2 text-blue-600 font-medium"
          >
            Contribution: {details.contribution}
          </p>
        )}
      </div>
    </div>
  );
};

const ProponentsSection: React.FC<{
  proponents: ProponentDetails[];
  fontSize: number;
}> = ({ proponents, fontSize }) => (
  <div className="mb-6">
    {proponents.length > 1 && (
      <h2
        style={{ fontSize: `${fontSize * 1.25}px` }}
        className="font-bold mb-4"
      >
        Key Contributors
      </h2>
    )}
    <div className="grid gap-4">
      {proponents.map((proponent, index) => (
        <ProponentCard key={index} details={proponent} fontSize={fontSize} />
      ))}
    </div>
  </div>
);

const ImagePreviewDialog: React.FC<{
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}> = ({ images, initialIndex = 0, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);

  // Update the index when the dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <img
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            className="w-full max-h-[80vh] object-contain"
          />

          {images.length > 1 && (
            <div className="text-center mt-4">
              <span>
                Image {currentImageIndex + 1} of {images.length}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ExampleSection: React.FC<{
  example: {
    title?: string;
    description: string[];
    images: string[];
  };
  fontSize: number;
}> = ({ example, fontSize }) => {
  const [imagePreviewState, setImagePreviewState] = useState<{
    isOpen: boolean;
    imageIndex: number;
  }>({
    isOpen: false,
    imageIndex: 0,
  });

  const openImagePreview = (index: number) => {
    setImagePreviewState({
      isOpen: true,
      imageIndex: index,
    });
  };

  const closeImagePreview = () => {
    setImagePreviewState({
      isOpen: false,
      imageIndex: 0,
    });
  };

  return (
    <div className="mt-4">
      <h2
        style={{ fontSize: `${fontSize * 1.25}px` }}
        className="font-bold mb-4"
      >
        Real-life Example
      </h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3
          style={{ fontSize: `${fontSize * 1.125}px` }}
          className="font-semibold mb-3"
        >
          {example.title}
        </h3>

        {example.images && example.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {example.images.map((imageSrc, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <img
                    src={imageSrc}
                    alt={`${example.title} image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    onClick={() => openImagePreview(index)}
                  />
                </TooltipTrigger>
                <TooltipContent>Click to view full image</TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        <ul className="list-disc ml-6 space-y-2">
          {example.description.map((desc, descIndex) => (
            <li key={descIndex} style={{ fontSize: `${fontSize}px` }}>
              {desc}
            </li>
          ))}
        </ul>
      </div>

      <ImagePreviewDialog
        images={example.images || []}
        initialIndex={imagePreviewState.imageIndex}
        isOpen={imagePreviewState.isOpen}
        onClose={closeImagePreview}
      />
    </div>
  );
};

export const InfoSheet: React.FC<InfoSheetProps> = ({
  title,
  subtitle,
  headerIcon = <Info />,
  proponents = [],
  sections,
  examples = [],
  className = "",
}) => {
  const { state, setUiState } = useWalkthrough();
  const [localOpen, setLocalOpen] = useState(false);

  const isWalkthroughActive = state.tourActive;
  const isWalkthroughOpen = state.uiState["info-sheet"]?.isOpen || false;

  const isOpen = isWalkthroughActive ? isWalkthroughOpen : localOpen;

  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 1 + examples.length;

  const handleOpenChange = (open: boolean) => {
    if (isWalkthroughActive) {
      setUiState("info-sheet", { isOpen: open });
    } else {
      setLocalOpen(open);
    }
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const renderSection = (
    section: {
      title?: string;
      type?: "paragraph" | "list";
      content: string | string[];
    },
    fontSize: number
  ) => {
    const formatQuote = (text: string) => {
      const quoteRegex = /^"(.*)"$/;
      const match = text.match(quoteRegex);

      if (match) {
        return <i>"{match[1]}"</i>;
      }
      return text;
    };

    switch (section.type) {
      case "list":
        return (
          <div className="mt-4">
            {section.title && (
              <h3
                style={{ fontSize: `${fontSize * 1.125}px` }}
                className="font-bold mb-2"
              >
                {section.title}
              </h3>
            )}
            <ul className="list-disc pl-5">
              {(section.content as string[]).map((item, itemIndex) => (
                <li key={itemIndex} style={{ fontSize: `${fontSize}px` }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return (
          <div className="mt-4">
            {section.title && (
              <h3
                style={{ fontSize: `${fontSize * 1.125}px` }}
                className="font-bold mb-2"
              >
                {section.title}
              </h3>
            )}
            <p style={{ fontSize: `${fontSize}px` }} className="text-justify">
              {formatQuote(section.content as string)}
            </p>
          </div>
        );
    }
  };

  const renderCurrentSlide = () => {
    if (currentSlide === 0) {
      return (
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-20rem)] h-md:max-h-[calc(100vh-12rem)]">
          {proponents.length > 0 && (
            <ProponentsSection proponents={proponents} fontSize={fontSize} />
          )}
          {sections.map((section) => renderSection(section, fontSize))}
        </div>
      );
    } else {
      const exampleIndex = currentSlide - 1;
      return (
        <ExampleSection example={examples[exampleIndex]} fontSize={fontSize} />
      );
    }
  };

  const sheetClassName = `
    overflow-hidden
    ${isExpanded ? "min-w-[90vw] h-screen" : "min-w-[50vw]"}
    ${className}
  `;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button className="info-sheet-button">
              {headerIcon} About {title}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          Click to view more information about {title}
        </TooltipContent>
      </Tooltip>
      <SheetContent
        className={`info-sheet-content sm:w-auto w-[95vw] h-screen overflow-y-auto ${sheetClassName}`}
        onInteractOutside={(event) =>
          isWalkthroughOpen ? event.preventDefault() : null
        }
      >
        <div className={`flex flex-col ${className || ""}`}>
          <div className="flex justify-between items-center flex-wrap mb-4">
            <div className="space-y-2">
              <p
                style={{ fontSize: `${fontSize * 0.875}px` }}
                className="flex gap-1 items-center"
              >
                <Atom size={fontSize} />
                {subtitle && <span>{subtitle}</span>}
              </p>
              <h1
                style={{ fontSize: `${fontSize * 2}px` }}
                className="font-bold"
              >
                {title}
              </h1>
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2 info-sheet-font-size-controls">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                  title="Decrease font size"
                >
                  <Minus size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 32}
                  title="Increase font size"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={toggleExpand}
                title={isExpanded ? "Minimize" : "Expand"}
                className="info-sheet-expand-control bg-yellow-400 hover:bg-yellow-300 text-black"
              >
                {isExpanded ? <Minimize size={16} /> : <Expand size={16} />}
              </Button>
            </div>
          </div>

          <div className="flex-1">{renderCurrentSlide()}</div>

          {examples.length > 0 && (
            <div className="flex sm:flex-row gap-2 flex-col items-center justify-between mt-4 pt-4 border-t info-sheet-pagination">
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="mr-2" size={16} />
                {currentSlide === 0 ? "Main Content" : "Previous Example"}
              </Button>
              <span style={{ fontSize: `${fontSize}px` }}>
                {currentSlide === 0
                  ? "Main Content"
                  : `Example ${currentSlide} of ${examples.length}`}
              </span>
              <Button
                variant="outline"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
              >
                {currentSlide === 0 ? "View Examples" : "Next Example"}
                <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
