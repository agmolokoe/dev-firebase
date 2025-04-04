
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Share2, Mail, MessageSquare, Megaphone } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold gradient-text">Marketing Tools</h1>
        <p className="text-muted-foreground">Promote your store and reach more customers</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-white/10 hover:border-[#25F4EE]/30 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-md bg-[#25F4EE]/10">
                <QrCode className="h-5 w-5 text-[#25F4EE]" />
              </div>
              <CardTitle>QR Codes</CardTitle>
            </div>
            <CardDescription>
              Generate QR codes for your store and products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 mb-6">
              Create custom QR codes that customers can scan to visit your store or view specific products.
            </p>
            <div className="h-32 w-32 mx-auto bg-white p-2 rounded-md">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <QrCode className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#25F4EE] text-black hover:bg-[#25F4EE]/90">
              Generate QR Code
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-white/10 hover:border-[#FE2C55]/30 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-md bg-[#FE2C55]/10">
                <Share2 className="h-5 w-5 text-[#FE2C55]" />
              </div>
              <CardTitle>Social Sharing</CardTitle>
            </div>
            <CardDescription>
              Share your store and products on social media
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 mb-6">
              Create and schedule posts to promote your products across popular social media platforms.
            </p>
            <div className="flex gap-3 justify-center">
              <div className="h-10 w-10 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.03 10.03 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#833AB4]/20 via-[#FD1D1D]/20 to-[#FCAF45]/20 flex items-center justify-center">
                <svg className="h-5 w-5 text-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#FE2C55] text-white hover:bg-[#FE2C55]/90">
              Create Social Post
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border-white/10 hover:border-white/30 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-md bg-white/10">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Email Campaigns</CardTitle>
            </div>
            <CardDescription>
              Send email campaigns to your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 mb-6">
              Create and send email campaigns to promote products, announce sales, or share important updates.
            </p>
            <div className="border border-white/10 rounded-md p-3">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-white/60" />
                <span className="text-sm font-medium">New Campaign</span>
              </div>
              <div className="h-6 w-full bg-white/10 rounded-sm mb-2"></div>
              <div className="h-16 w-full bg-white/5 rounded-sm"></div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
              Create Campaign
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
