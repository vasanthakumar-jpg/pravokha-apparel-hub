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
    <Card className={`group relative overflow-hidden hover:shadow-xl transition-all duration-500 ${disabled ? 'opacity-60' : ''}`}>
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent" />
        
        {/* Hover overlay with animated text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-foreground/60 backdrop-blur-sm">
          <div className="text-center px-6 animate-fade-up">
            <h3 className="text-3xl font-bold text-background mb-3">{title}</h3>
            <p className="text-background/90 text-lg">{description}</p>
          </div>
        </div>
        
        {/* Default state */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transition-all duration-500 group-hover:opacity-0">
          <h3 className="text-2xl font-bold text-background">{title}</h3>
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
