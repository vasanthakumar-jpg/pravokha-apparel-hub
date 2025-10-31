import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Support() {
  const supportOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      action: "vasanthakumar141099@gmail.com",
      link: "mailto:vasanthakumar141099@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us during business hours",
      action: "7339232817, 7708368442",
      link: "tel:+917339232817",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      link: "/contact",
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Find answers to common questions",
      action: "View FAQ",
      link: "/faq",
    },
  ];

  return (
    <div className="container py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Support Center</h1>
        <p className="text-muted-foreground text-center mb-12 text-lg">
          We're here to help! Choose how you'd like to get in touch.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {option.link.startsWith("http") || option.link.startsWith("mailto") || option.link.startsWith("tel") ? (
                    <a href={option.link} className="block">
                      <Button variant="outline" className="w-full">
                        {option.action}
                      </Button>
                    </a>
                  ) : (
                    <Link to={option.link}>
                      <Button variant="outline" className="w-full">
                        {option.action}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Orders</CardTitle>
            <CardDescription>
              Need to place a bulk order? We offer special pricing for large quantities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              For bulk orders (50+ items), please contact our sales team directly:
            </p>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:vasanthakumar141099@gmail.com" className="text-primary hover:underline">
                  vasanthakumar141099@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+917339232817" className="text-primary hover:underline">
                  7339232817
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
