import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface BenchmarkFiltersProps {
  categories: string[];
  onFilterChange: (filters: {
    categories: string[];
    timeRange: string;
    successOnly: boolean;
  }) => void;
}

export function BenchmarkFilters({
  categories,
  onFilterChange,
}: BenchmarkFiltersProps) {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(categories);
  const [timeRange, setTimeRange] = useState("day");
  const [successOnly, setSuccessOnly] = useState(false);

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newCategories);
    onFilterChange({ categories: newCategories, timeRange, successOnly });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategories.includes(category)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time Range</label>
            <div className="flex gap-2">
              {["hour", "day", "week", "month"].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTimeRange(range);
                    onFilterChange({
                      categories: selectedCategories,
                      timeRange: range,
                      successOnly,
                    });
                  }}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div>
              <Button
                variant={successOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSuccessOnly(!successOnly);
                  onFilterChange({
                    categories: selectedCategories,
                    timeRange,
                    successOnly: !successOnly,
                  });
                }}
              >
                Success Only
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
