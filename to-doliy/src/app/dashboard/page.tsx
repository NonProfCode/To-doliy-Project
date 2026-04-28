
import WelcomeCard from "@/app/ui/Card/Welcome_Card/Welcome_Card";
import Priority_Card from "@/app/ui/Card/Priority_Card/Priority_Card";
import Schedule_Card from "@/app/ui/Card/Schedule_Card/Schedule_Card";
import Short_Cut_Card from "@/app/ui/Card/Short_Cut_Card/Short_Cut_Card";
import Statistics_Card from "@/app/ui/Card/Statistics_Card/Statistics_Card";

export default function Dashboard() {

    return (
      <>

      <WelcomeCard />
      
      {/* 1st line */}
      <div className="grid grid-cols-2 mt-4 gap-4 ">
        <div className="grid grid-row-2 gap-4 ">
          <Priority_Card />
          <Schedule_Card />
        </div>
      
      {/* 2nd line */}
      <div className="grid grid-row-2 gap-4">
          <Short_Cut_Card />
          <Statistics_Card />
      </div>
          
          
      </div>
      
      </>
    );

}