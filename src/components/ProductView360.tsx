import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCw, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductView360Props {
  images: string[];
  open: boolean;
  onClose: () => void;
}

export default function ProductView360({ images, open, onClose }: ProductView360Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setCurrentIndex(0);
    }
  }, [open]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const diff = e.clientX - startX;
    const sensitivity = 10;
    
    if (Math.abs(diff) > sensitivity) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const diff = e.touches[0].clientX - startX;
    const sensitivity = 10;
    
    if (Math.abs(diff) > sensitivity) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0">
        <div className="relative w-full bg-muted">
          <div className="absolute top-4 left-4 bg-background/80 px-3 py-2 rounded-full flex items-center gap-2 z-10">
            <RotateCw className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-sm font-medium">Drag to rotate 360°</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-background/80 hover:bg-background z-10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div
            ref={containerRef}
            className="aspect-square cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[currentIndex]}
              alt={`360° view ${currentIndex + 1}`}
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
