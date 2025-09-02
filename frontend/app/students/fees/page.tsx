'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentsFeesRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct student fees page
    router.replace('/student/fees');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to student fees page...</p>
      </div>
    </div>
  );
}
