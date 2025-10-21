"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Student = {
  id: string;
  student_number?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  email?: string;
  department?: string;
  program?: string;
  year_level?: string;
  created_at?: string;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase
          .from("students")
          .select("id, student_number, first_name, middle_name, last_name, email, department, program, year_level, created_at")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        setStudents(data || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getFullName = (s: Student) => {
    return [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" ");
  };

  return (
    <div className="font-sans min-h-screen p-8 sm:p-16 bg-gray-50">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎓 Student Records</h1>

        {loading && <p className="text-sm text-gray-500">Loading students...</p>}
        {error && <p className="text-red-600 font-medium">Error: {error}</p>}

        {!loading && !error && (
          <>
            {students.length === 0 ? (
              <p className="text-gray-600">No student records found.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-600">ID</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Name</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Department</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Program</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Year</th>
                      <th className="px-4 py-3 font-semibold text-gray-600">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-700">{s.id}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium">
                          {getFullName(s) || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{s.email || "—"}</td>
                        <td className="px-4 py-3 text-gray-700">{s.department || "—"}</td>
                        <td className="px-4 py-3 text-gray-700">{s.program || "—"}</td>
                        <td className="px-4 py-3 text-gray-700">{s.year_level || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {s.created_at
                            ? new Date(s.created_at).toLocaleString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
