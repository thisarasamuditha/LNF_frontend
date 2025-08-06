import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Lost & Found
                </h1>
                <p className="text-xs text-muted-foreground">Search Items</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
              Search Lost & Found Items
            </CardTitle>
            <p className="text-gray-600">
              This page is under construction. We're building an advanced search system 
              with filters for location, date, category, and more.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Placeholder Search Interface */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for items..."
                className="pl-12 py-4 text-lg rounded-xl"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" disabled className="h-12 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                Category Filter
              </Button>
              <Button variant="outline" disabled className="h-12 rounded-xl">
                <MapPin className="w-4 h-4 mr-2" />
                Location Filter
              </Button>
              <Button variant="outline" disabled className="h-12 rounded-xl">
                <Calendar className="w-4 h-4 mr-2" />
                Date Filter
              </Button>
            </div>

            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Want this page completed? Continue prompting to have it built out with full search functionality!
              </p>
              <Button asChild>
                <Link to="/">Return to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
