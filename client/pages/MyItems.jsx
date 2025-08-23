// Import necessary React hooks and routing components
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";

// Import Lucide React icons for UI elements
import { ArrowLeft, MapPin, Calendar, Tag, Trash2 } from "lucide-react";

// Import UI components from shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyItems() {
  // Get authentication status from context
  const { isAuthenticated } = useAuth();

  // State management for component data
  const [items, setItems] = useState([]); // Array to store user's items
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(""); // Error message state
  const [filterType, setFilterType] = useState("ALL"); // Filter state: ALL, LOST, FOUND

  // Effect hook to fetch user items when component mounts or authentication changes
  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        setLoading(true);

        // Safely parse the user data from localStorage
        const userStr = localStorage.getItem("user");
        let user = null;

        try {
          user = userStr ? JSON.parse(userStr) : null;
        } catch (e) {
          user = null; // If parsing fails, set user to null
        }

        // Check if user exists and has an ID
        if (!user || !user.id) {
          setError("Please sign in to view your items.");
          setItems([]);
          return;
        }

        // Fetch user's items from the backend API
        const response = await axios.get(
          `${API_BASE_URL}/api/items/user/${user.id}`,
        );
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

    // Only fetch items if user is authenticated
    if (isAuthenticated) {
      fetchMyItems();
    } else {
      setError("Please sign in to view your items.");
      setLoading(false);
    }
  }, [isAuthenticated]); // Dependency array: re-run when authentication status changes

  // Handle deleting an item
  const handleDeleteItem = async (itemId) => {
    try {
      // Confirm deletion with user
      if (!window.confirm("Are you sure you want to delete this item?")) {
        return;
      }

      // Call DELETE API endpoint
      await axios.delete(`${API_BASE_URL}/api/items/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Update local state by removing the deleted item
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

      console.log(`Item ${itemId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting item:", error);
      // Show error message to user
      if (error.response?.status === 403) {
        alert("You can only delete your own items.");
      } else {
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  // Filter items based on selected type (ALL, LOST, FOUND)
  const filteredItems = items.filter((item) => {
    if (filterType === "ALL") return true; // Show all items
    return item.type === filterType; // Show only items matching the selected type
  });

  // Render sign-in required page if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your items.
            </p>
            <Button asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
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

            {/* Back to Home Button */}
            <Button asChild variant="outline" size="sm">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">My Items</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              View all the items you've reported as lost or found.
            </p>
          </div>

          {/* Filter Section - Only show if user has items */}
          {items.length > 0 && (
            <div className="mb-8">
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Filter Section Title */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Filter Items
                      </h3>
                      <p className="text-sm text-gray-600">
                        Show items by type
                      </p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                      {/* All Items Button */}
                      <Button
                        variant={filterType === "ALL" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("ALL")}
                        className="rounded-xl"
                      >
                        All Items ({items.length})
                      </Button>

                      {/* Lost Items Button */}
                      <Button
                        variant={filterType === "LOST" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("LOST")}
                        className="rounded-xl bg-red-600 hover:bg-red-700"
                      >
                        Lost (
                        {items.filter((item) => item.type === "LOST").length})
                      </Button>

                      {/* Found Items Button */}
                      <Button
                        variant={filterType === "FOUND" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterType("FOUND")}
                        className="rounded-xl bg-green-600 hover:bg-green-700"
                      >
                        Found (
                        {items.filter((item) => item.type === "FOUND").length})
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Items Display Section - Conditional rendering based on state */}
          {loading ? (
            // Loading State
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your items...</p>
            </div>
          ) : error ? (
            // Error State
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
            // Empty State - No items found
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {filterType === "ALL"
                  ? "No Items Yet"
                  : `No ${filterType} Items`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filterType === "ALL"
                  ? "You haven't reported any items yet."
                  : `You don't have any ${filterType.toLowerCase()} items.`}
              </p>
            </div>
          ) : (
            // Items Grid - Display filtered items
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                // Individual Item Card
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                >
                  {/* Item Image Section */}
                  <div className="relative">
                    <img
                      src={item.imageUrl || "/LNF_image.jpg"}
                      alt={item.title}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.target.src = "/LNF_image.jpg";
                      }}
                    />

                    {/* Item Type Badge (LOST/FOUND) */}
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

                  {/* Item Details Section */}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {/* Location Information */}
                      <div className="flex items-center text-gray-500 mb-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </div>
                      {/* Date Information */}
                      <div className="flex items-center text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </CardDescription>
                  </CardHeader>

                  {/* Item Category Badge */}
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>

                      {/* Delete Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
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
