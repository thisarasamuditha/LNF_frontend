import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import axios from "axios";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyItems() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("ALL"); // ALL, LOST, FOUND

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        setLoading(true);
        // Get user info from localStorage
        const userStr = localStorage.getItem("user");
        let user = null;
        try {
          user = userStr ? JSON.parse(userStr) : null;
        } catch (e) {
          user = null;
        }

        if (!user || !user.id) {
          setError("Please sign in to view your items.");
          setItems([]);
          return;
        }

        const response = await axios.get(`http://localhost:8088/api/items/user/${user.id}`);
        setItems(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching user items:", err);
        setError("Failed to load your items. Please try again later.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMyItems();
    } else {
      setError("Please sign in to view your items.");
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Filter items based on selected type
  const filteredItems = items.filter((item) => {
    if (filterType === "ALL") return true;
    return item.type === filterType;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your items.</p>
            <Button asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Lost & Found
                </h1>
                <p className="text-xs text-muted-foreground">My Items</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              My Items
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View all the items you've reported as lost or found.
            </p>
          </div>

          {/* Filter Section */}
          {items.length > 0 && (
            <div className="mb-8">
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Filter Items</h3>
                      <p className="text-sm text-gray-600">Show items by type</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={filterType === "ALL" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("ALL")}
                        className="rounded-xl"
                      >
                        All Items ({items.length})
                      </Button>
                      <Button
                        variant={filterType === "LOST" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("LOST")}
                        className="rounded-xl bg-red-600 hover:bg-red-700"
                      >
                        Lost ({items.filter(item => item.type === "LOST").length})
                      </Button>
                      <Button
                        variant={filterType === "FOUND" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("FOUND")}
                        className="rounded-xl bg-green-600 hover:bg-green-700"
                      >
                        Found ({items.filter(item => item.type === "FOUND").length})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Items Display */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your items...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="rounded-xl"
              >
                Try Again
              </Button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {filterType === "ALL" ? "No Items Yet" : `No ${filterType} Items`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterType === "ALL" 
                  ? "You haven't reported any items yet."
                  : `You don't have any ${filterType.toLowerCase()} items.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${
                        item.type === "LOST"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.type}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm">
                      <div className="flex items-center text-gray-500 mb-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 