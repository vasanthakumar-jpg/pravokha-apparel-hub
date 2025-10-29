import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Star, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProductReviewsProps {
  productId: string;
}

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    checkUser();
    fetchReviews();
  }, [productId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchReviews = async () => {
    // Reviews fetching will be implemented after database setup
    setReviews([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3);
      setImages(files);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Upload images if any
      let imageUrls: string[] = [];
      if (images.length > 0) {
        // For now, we'll store image names. In production, you'd upload to storage
        imageUrls = images.map(img => img.name);
      }

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title: reviewTitle,
        comment: reviewText,
        images: imageUrls,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Review Submitted!",
        description: "Your review is pending approval. Thank you!",
      });

      // Reset form
      setRating(0);
      setReviewTitle("");
      setReviewText("");
      setImages([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Submit Review Form */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        {user ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <Label>Your Rating</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="review-title">Review Title</Label>
              <Input
                id="review-title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div>
              <Label htmlFor="review-text">Your Review</Label>
              <Textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="review-images">Add Photos (Optional)</Label>
              <div className="mt-2">
                <label
                  htmlFor="review-images"
                  className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-sm">
                    {images.length > 0
                      ? `${images.length} image(s) selected`
                      : "Click to upload images (Max 3)"}
                  </span>
                </label>
                <Input
                  id="review-images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        ) : (
          <p className="text-muted-foreground">
            Please{" "}
            <a href="/auth" className="text-primary underline">
              sign in
            </a>{" "}
            to write a review.
          </p>
        )}
      </Card>

      {/* Display Reviews */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Customer Reviews ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-muted-foreground">{review.comment}</p>
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {review.images.map((img: string, i: number) => (
                    <div key={i} className="h-20 w-20 rounded-lg border overflow-hidden">
                      <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        Image {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
