import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Body_about(){
    const router = useRouter();
    useEffect(() => {
      const fetchInfo = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/");
          return;
        }
      };
  
      fetchInfo();
    }, [router]);
    return(
        <main>
            <p>Ini Bodyku</p>
        </main>
    )
}