interface Checkin {
    id: string;
    user_id: string;
    student_id: string;
    checkin_at: string;
    checkout_at: string;
  }
  
  interface IntervalCheckinsSuccess {
    data: Checkin[];
    message: string;
  }
  
  
  interface ChartData {
    date: string;
    day: number;
    night: number;
  }
  
  
  export function transformCheckinData(
    checkinData: IntervalCheckinsSuccess | null
  ): ChartData[] {
    if (!checkinData || !checkinData.data) {
      return [];
    }
      const groupedData: { [date: string]: { day: number; night: number } } = {};
  
  
    checkinData.data.forEach((checkin) => {
      const checkinDate = checkin.checkin_at.split(" ")[0];
      const checkinTime = checkin.checkin_at.split(" ")[1];
  
        if (!groupedData[checkinDate]) {
          groupedData[checkinDate] = { day: 0, night: 0 };
          }
      const checkInHour = parseInt(checkinTime.split(":")[0]);
  
      if (checkInHour >= 6 && checkInHour < 18) {
          groupedData[checkinDate].day++;
          } else {
          groupedData[checkinDate].night++;
      }
  });
  
    const chartData: ChartData[] = Object.entries(groupedData).map(
      ([date, counts]) => ({
        date,
        day: counts.day,
        night: counts.night,
      })
    );
  
    return chartData;
  }