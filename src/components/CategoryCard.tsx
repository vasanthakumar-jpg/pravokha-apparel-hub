import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import LazyImage from "./LazyImage";
import { Badge } from "./ui/badge";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
  comingSoon?: boolean;
}

export const CategoryCard = ({ title, description, image, link, comingSoon }: CategoryCardProps) => {
  const CardContent = (
    <motion.div
      whileHover={{ scale: comingSoon ? 1 : 1.03 }}
      whileTap={{ scale: comingSoon ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 h-full gsap-scale-in ${comingSoon ? 'opacity-60' : 'cursor-pointer'}`}>
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <LazyImage
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          {comingSoon && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-destructive text-destructive-foreground">Coming Soon</Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2">{title}</h3>
            <p className="text-xs sm:text-sm md:text-base opacity-90 line-clamp-2">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (comingSoon || !link) {
    return CardContent;
  }

  return <Link to={link}>{CardContent}</Link>;
};
