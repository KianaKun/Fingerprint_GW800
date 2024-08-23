This Website is created using NextJS, Axios, ZKLib, NodeJS, Tailwind.
====

Init
-----
clone repository

cd */Fingerprint_Projects

npm install

npm run dev for development

npm run build for build

ZKLib How To Use
-----
    const ZKLib = require('zklib-js');

    const test = async () => {
  
    let zkInstance = new ZKLib('192.168.1.201', 4370, 5200, 5000);

    try {
    
        // Create socket to machine
    
        await zkInstance.createSocket();

        // Get general info like logCapacity, user counts, logs count
        
        console.log(await zkInstance.getInfo());
    
        // Get users in machine
        
        const users = await zkInstance.getUsers();
        
        console.log(users);
    
        // Get all logs in the machine
        
        const logs = await zkInstance.getAttendances();
        
        console.log("Logs:", logs);
    
        const attendanceSize = await zkInstance.getAttendanceSize();
       
        console.log(attendanceSize);
    
        // Clear Attendance Log
        await zkInstance.clearAttendanceLog();
    
        } catch (error) {
        
        console.error("Error:", error);
      
        } finally {
        
        // Disconnect the machine
        
        await zkInstance.disconnect();
      
        }

    };

    test();
