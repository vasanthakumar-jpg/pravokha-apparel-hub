import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface CategorySmallCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  disabled?: boolean;
}

export const CategorySmallCard = ({ title, description, image, link, disabled }: CategorySmallCardProps) => {
  const CardContent = () => (
    <Card className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 ${disabled ? 'opacity-60' : ''}`}>
      <div className="aspect-square overflow-hidden relative h-72 md:h-96">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
        
        {/* Hover overlay with animated text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-t from-black/95 via-black/70 to-black/30 backdrop-blur-sm">
          <div className="text-center px-8 transform translate-y-6 group-hover:translate-y-0 transition-all duration-700">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-up">{title}</h3>
            <p className="text-white/95 text-base md:text-lg animate-fade-up">{description}</p>
          </div>
        </div>
        
        {/* Default state */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10 transition-all duration-700 group-hover:opacity-0 group-hover:translate-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{title}</h3>
        </div>
      </div>
    </Card>
  );

  if (disabled) {
    return <CardContent />;
  }

  return (
    <Link to={link} className="block">
      <CardContent />
    </Link>
  );
};
