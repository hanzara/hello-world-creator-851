import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ResultData = {
  marks: number;
  out_of: number;
  grade: string | null;
  teacher_remark: string | null;
  exam_schedules: {
    subjects: { name: string };
    exams: { name: string };
  };
};

export const StudentResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<ResultData[]>([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    try {
      // Get student ID
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!studentData) return;

      // Fetch results
      const { data: resultsData } = await supabase
        .from('results')
        .select(`
          marks,
          out_of,
          grade,
          teacher_remark,
          exam_schedules(
            subjects(name),
            exams(name)
          )
        `)
        .eq('student_id', studentData.id)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (resultsData) {
        setResults(resultsData);
        // Calculate average
        const avg = resultsData.reduce((sum, r) => sum + (r.marks / r.out_of) * 100, 0) / resultsData.length;
        setAverage(Math.round(avg));
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (marks: number, outOf: number) => {
    const percentage = (marks / outOf) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBestSubject = () => {
    if (results.length === 0) return 'N/A';
    const best = results.reduce((prev, current) => 
      ((current.marks / current.out_of) > (prev.marks / prev.out_of)) ? current : prev
    );
    return best.exam_schedules.subjects.name;
  };

  if (loading) {
    return <div className="p-6">Loading results...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Average</p>
              <h3 className="text-2xl font-bold mt-1">{average}%</h3>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Exams</p>
              <h3 className="text-2xl font-bold mt-1">{results.length}</h3>
            </div>
            <Award className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Best Subject</p>
              <h3 className="text-lg font-bold mt-1">{getBestSubject()}</h3>
            </div>
            <Award className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Results</h3>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Report Card
          </Button>
        </div>

        {results.length === 0 ? (
          <p className="text-muted-foreground">No results available yet</p>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => {
              const percentage = Math.round((result.marks / result.out_of) * 100);
              return (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                      {result.exam_schedules.subjects.name} - {result.exam_schedules.exams.name}
                    </span>
                    <span className={`text-2xl font-bold ${getGradeColor(result.marks, result.out_of)}`}>
                      {result.marks}/{result.out_of}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Grade: {result.grade || 'N/A'}</span>
                    <span>Percentage: {percentage}%</span>
                  </div>
                  {result.teacher_remark && (
                    <p className="text-sm mt-2 text-muted-foreground bg-muted p-2 rounded">
                      Teacher's Remark: {result.teacher_remark}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        {results.length === 0 ? (
          <p className="text-muted-foreground">No data available</p>
        ) : (
          <div className="space-y-3">
            {results.slice(0, 5).map((result, index) => {
              const percentage = (result.marks / result.out_of) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{result.exam_schedules.subjects.name}</span>
                    <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
