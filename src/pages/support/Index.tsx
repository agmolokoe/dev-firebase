
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, LifeBuoy, FileText, BookOpen, ExternalLink } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Help & Support</h1>
        <p className="text-muted-foreground">Get assistance and resources for your Baseti account</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-white/10 hover:border-[#25F4EE]/30 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-md bg-[#25F4EE]/10">
                <MessageSquare className="h-5 w-5 text-[#25F4EE]" />
              </div>
              <CardTitle>Contact Support</CardTitle>
            </div>
            <CardDescription>
              Reach out to our support team for personalized assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" placeholder="What do you need help with?" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea id="message" placeholder="Describe your issue in detail" rows={4} />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#25F4EE] text-black hover:bg-[#25F4EE]/90">
              Submit Ticket
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-white/10 hover:border-[#FE2C55]/30 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-md bg-[#FE2C55]/10">
                <LifeBuoy className="h-5 w-5 text-[#FE2C55]" />
              </div>
              <CardTitle>Help Center</CardTitle>
            </div>
            <CardDescription>
              Browse our knowledge base for answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="p-3 border border-white/10 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-white/60" />
                    <span>Getting Started Guide</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-white/60" />
                </div>
              </div>
              
              <div className="p-3 border border-white/10 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-white/60" />
                    <span>Subscription & Billing FAQ</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-white/60" />
                </div>
              </div>
              
              <div className="p-3 border border-white/10 rounded-md hover:bg-white/5 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-white/60" />
                    <span>Store Setup Instructions</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-white/60" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Browse All Articles</span>
              </div>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
