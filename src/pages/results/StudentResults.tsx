import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Award } from "lucide-react";

export const StudentResults = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Average</p>
              <h3 className="text-2xl font-bold mt-1">78%</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Class Position</p>
              <h3 className="text-2xl font-bold mt-1">5th</h3>
            </div>
            <Award className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Best Subject</p>
              <h3 className="text-lg font-bold mt-1">Mathematics</h3>
            </div>
            <Award className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Term 1, 2025 - CAT 1 Results</h3>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Report Card
          </Button>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Mathematics</span>
              <span className="text-2xl font-bold text-primary">85</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Grade: A</span>
              <span>Class Average: 72</span>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              Teacher's Remark: Excellent performance. Keep up the good work!
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">English</span>
              <span className="text-2xl font-bold text-primary">78</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Grade: B+</span>
              <span>Class Average: 70</span>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              Teacher's Remark: Good work. Focus on essay writing skills.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Science</span>
              <span className="text-2xl font-bold text-primary">72</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Grade: B</span>
              <span>Class Average: 68</span>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              Teacher's Remark: Satisfactory. More practice needed in practical work.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Mathematics</span>
              <span className="text-sm text-green-600">↑ +7%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">English</span>
              <span className="text-sm text-green-600">↑ +3%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Science</span>
              <span className="text-sm text-red-600">↓ -2%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
