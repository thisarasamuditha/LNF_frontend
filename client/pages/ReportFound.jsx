import { Link } from "react-router-dom";
import { Camera, MapPin, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Lost & Found
                </h1>
                <p className="text-xs text-muted-foreground">Report Found Item</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Report a Found Item
            </CardTitle>
            <p className="text-gray-600">
              This page is under construction. We're building a comprehensive form 
              to help you report found items and reunite them with their owners.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Placeholder Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <Input placeholder="e.g., Blue Water Bottle" disabled className="rounded-xl" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea 
                  placeholder="Provide detailed description of the found item..."
                  disabled 
                  className="rounded-xl"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Found
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Student Union" disabled className="pl-10 rounded-xl" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Found
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input type="date" disabled className="pl-10 rounded-xl" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Photo upload functionality coming soon</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location of Item
                </label>
                <Input placeholder="Where is the item being held?" disabled className="rounded-xl" />
              </div>
              
              <Button className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-3" disabled>
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Found Item Report
              </Button>
            </div>

            <div className="text-center py-4 border-t">
              <p className="text-gray-500 mb-4">
                Want this page completed? Continue prompting to have it built out with full reporting functionality!
              </p>
              <Button asChild variant="outline">
                <Link to="/">Return to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
