import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CategorySmallCardProps {
  title: string;
  image: string;
  link: string;
  disabled?: boolean;
}

export const CategorySmallCard = ({ title, image, link, disabled }: CategorySmallCardProps) => {
  const CardContent = () => (
    <Card className={`group relative overflow-hidden hover:shadow-xl transition-all duration-300 ${disabled ? 'opacity-60' : ''}`}>
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
          <h3 className="font-bold text-2xl text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {title}
          </h3>
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
