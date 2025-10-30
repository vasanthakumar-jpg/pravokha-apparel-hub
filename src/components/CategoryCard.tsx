import { Link } from "react-router-dom";
import { Card } from "./ui/card";
import { motion } from "framer-motion";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

export const CategoryCard = ({ title, description, image, link }: CategoryCardProps) => {
  return (
    <Link to={link}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{title}</h3>
              <p className="text-sm md:text-base opacity-90">{description}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};
