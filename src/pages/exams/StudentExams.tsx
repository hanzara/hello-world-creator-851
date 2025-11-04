import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

type ExamSchedule = {
  id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  room: string | null;
  materials_allowed: string | null;
  subjects: { name: string };
  exams: { name: string; exam_type: string };
};

export const StudentExams = () => {
  const { user } = useAuth();
  const [upcomingExams, setUpcomingExams] = useState<ExamSchedule[]>([]);
  const [completedExams, setCompletedExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchExams();
    }
  }, [user]);

  const fetchExams = async () => {
    try {
      // Get student's class
      const { data: studentData } = await supabase
        .from('students')
        .select('class_id')
        .eq('user_id', user?.id)
        .single();

      if (!studentData?.class_id) return;

      const today = new Date().toISOString().split('T')[0];

      // Fetch upcoming exams
      const { data: upcoming } = await supabase
        .from('exam_schedules')
        .select(`
          *,
          subjects(name),
          exams(name, exam_type)
        `)
        .eq('class_id', studentData.class_id)
        .gte('exam_date', today)
        .order('exam_date', { ascending: true });

      // Fetch completed exams
      const { data: completed } = await supabase
        .from('exam_schedules')
        .select(`
          *,
          subjects(name),
          exams(name, exam_type)
        `)
        .eq('class_id', studentData.class_id)
        .lt('exam_date', today)
        .order('exam_date', { ascending: false })
        .limit(10);

      setUpcomingExams(upcoming || []);
      setCompletedExams(completed || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntil = (date: string) => {
    const examDate = new Date(date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="p-6">Loading exams...</div>;
  }

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
            {upcomingExams.length === 0 ? (
              <p className="text-muted-foreground">No upcoming exams scheduled</p>
            ) : (
              <div className="space-y-4">
                {upcomingExams.map((exam) => {
                  const daysUntil = getDaysUntil(exam.exam_date);
                  return (
                    <div key={exam.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">
                          {exam.subjects.name} - {exam.exams.name}
                        </h4>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(exam.exam_date), 'MMMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{exam.start_time} - {exam.end_time} ({exam.duration_minutes} minutes)</span>
                        </div>
                        {exam.room && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{exam.room}</span>
                          </div>
                        )}
                        {exam.materials_allowed && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            <span>Allowed: {exam.materials_allowed}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Completed Exams</h3>
            {completedExams.length === 0 ? (
              <p className="text-muted-foreground">No completed exams</p>
            ) : (
              <div className="space-y-3">
                {completedExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{exam.exams.name} - {exam.subjects.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(exam.exam_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Exam Timetable</h3>
            {upcomingExams.length === 0 ? (
              <p className="text-muted-foreground">No exams scheduled</p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg font-semibold">
                  <span>Date</span>
                  <span>Subject</span>
                  <span>Time</span>
                </div>
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                    <span>{format(new Date(exam.exam_date), 'MMM dd')}</span>
                    <span>{exam.subjects.name}</span>
                    <span>{exam.start_time} - {exam.end_time}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
