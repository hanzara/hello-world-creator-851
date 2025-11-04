import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, FileText } from "lucide-react";

export const StudentExams = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upcoming Exams</h3>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Mathematics CAT 1</h4>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">In 3 days</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>February 15, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>2:00 PM - 3:30 PM (90 minutes)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Exam Room 101</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Allowed: Calculator, Mathematical tables</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">English CAT 1</h4>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">In 4 days</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>February 16, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>9:00 AM - 10:30 AM (90 minutes)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Exam Room 102</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Completed Exams</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Mid Term Exam - Mathematics</p>
                  <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Results Available</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Mid Term Exam - English</p>
                  <p className="text-sm text-muted-foreground">Dec 16, 2024</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Results Available</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Exam Timetable - Term 1, 2025</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg font-semibold">
                <span>Date</span>
                <span>Subject</span>
                <span>Time</span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                <span>Feb 15</span>
                <span>Mathematics</span>
                <span>2:00 PM - 3:30 PM</span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                <span>Feb 16</span>
                <span>English</span>
                <span>9:00 AM - 10:30 AM</span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                <span>Feb 17</span>
                <span>Science</span>
                <span>2:00 PM - 3:30 PM</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
