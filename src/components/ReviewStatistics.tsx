import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewStatisticsProps {
  rating: number;
  totalRatings: number;
  totalReviews: number;
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const ReviewStatistics = ({ 
  rating, 
  totalRatings, 
  totalReviews,
  distribution = { 5: 70, 4: 15, 3: 10, 2: 3, 1: 2 }
}: ReviewStatisticsProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-5xl font-bold">{rating.toFixed(1)}</div>
        <div className="flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(rating)
                  ? "fill-accent text-accent"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {totalRatings.toLocaleString()} ratings & {totalReviews} reviews
        </p>
      </div>

      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((stars) => {
          const percentage = distribution[stars as keyof typeof distribution];
          return (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{stars}</span>
                <Star className="h-3 w-3 fill-accent text-accent" />
              </div>
              <Progress value={percentage} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
