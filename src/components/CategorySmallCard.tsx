import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CategorySmallCardProps {
  title: string;
  price: string;
  image: string;
  link: string;
  disabled?: boolean;
}

export const CategorySmallCard = ({ title, price, image, link, disabled }: CategorySmallCardProps) => {
  const CardContent = () => (
    <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 ${disabled ? 'opacity-60' : ''}`}>
      <div className="aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          {disabled && (
            <Badge variant="secondary">Coming Soon</Badge>
          )}
        </div>
        <p className="text-2xl font-bold text-primary">{price}</p>
        <Button 
          className="w-full" 
          disabled={disabled}
        >
          {disabled ? 'Coming Soon' : 'Shop Now'}
        </Button>
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
