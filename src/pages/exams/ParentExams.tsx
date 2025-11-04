import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

type ExamSchedule = {
  id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room: string | null;
  subjects: { name: string };
  exams: { name: string };
};

export const ParentExams = () => {
  const { user } = useAuth();
  const [upcomingExams, setUpcomingExams] = useState<ExamSchedule[]>([]);
  const [completedExams, setCompletedExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChildrenExams();
    }
  }, [user]);

  const fetchChildrenExams = async () => {
    try {
      // Get parent's children
      const { data: children } = await supabase
        .from('parent_students')
        .select('student_id, students(class_id)')
        .eq('parent_id', user?.id);

      if (!children || children.length === 0) return;

      const classIds = children.map((c: any) => c.students.class_id).filter(Boolean);
      const today = new Date().toISOString().split('T')[0];

      // Fetch upcoming exams
      const { data: upcoming } = await supabase
        .from('exam_schedules')
        .select(`
          *,
          subjects(name),
          exams(name)
        `)
        .in('class_id', classIds)
        .gte('exam_date', today)
        .order('exam_date', { ascending: true })
        .limit(10);

      // Fetch completed exams
      const { data: completed } = await supabase
        .from('exam_schedules')
        .select(`
          *,
          subjects(name),
          exams(name)
        `)
        .in('class_id', classIds)
        .lt('exam_date', today)
        .order('exam_date', { ascending: false })
        .limit(5);

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
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Your Child's Upcoming Exams</h3>
        </div>
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
                      <span>{exam.start_time} - {exam.end_time}</span>
                    </div>
                    {exam.room && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{exam.room}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Exam History</h3>
        {completedExams.length === 0 ? (
          <p className="text-muted-foreground">No completed exams</p>
        ) : (
          <div className="space-y-3">
            {completedExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{exam.exams.name} - {exam.subjects.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(exam.exam_date), 'MMMM dd, yyyy')}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Completed</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
