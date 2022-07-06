import React, { useEffect } from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Team from "./components/Team/Team";

declare const window: any;

const App = () => {
  const handleEyelet = () => {
    // All API in one example.
    let allReady;
    // 1⃣. Check if Eyelet is ready
    let eyeletReady = new Promise((resolve) => {
      try {
        // It can be ready
        if (window.eyeletReady === true) resolve(true);
        // Or we need to wait for a moment
        else window.eyeletReadyPromise = () => resolve(true);
      } catch (error) {
        console.log("@stygianlgdonic ~ error", error);
      }
    });

    // Once Eyelet is ready...
    eyeletReady.then(() => {
      //2⃣. We can access User info.
      // It's {Object} if User exists and null if not.
      if (!window.eyelet.getUserInfo()) {
        // 3⃣. No User? Let's create one.
        let data = {
          name: "Bill",
          email: "Bill@example.com",
          createdAt: new Date().toISOString(),
          companyId: "BillCompanyId",
        };
        window.eyelet.auth(data);
      } else {
        // User exists? Let's authenticate them anyway.
        let data = {
          email: "Bill@example.com",
        };
        window.eyelet.auth(data);
      }
    });

    // 4⃣. Checking if User is ready or just created, the same way as eyeletReady logic works.
    let eyeletUserReady = new Promise((resolve) => {
      if (window.eyeletUserReady === true) resolve(true);
      window.eyeletUserReadyPromise = () => resolve(true);
    });

    // And when we've managed User...
    eyeletUserReady.then(() => {
      // 5⃣. We can, for example, add some segments
      let segments = ["happy", "customers"];
      window.eyelet.handleUserSegments("concat", segments, segmentsCallback);
      // And do something when segment is added
      function segmentsCallback(msg: any) {
        if (msg.success) {
          // 6⃣. For example, start a tour only if User has a particular segment
          if (msg.segments.indexOf("happy") !== -1)
            window.eyelet.startTour("myTourId");
        }
      }
    });
    // 7⃣. Also we can just know when Eyelet and User are finally ready and use this info later
    allReady = Promise.all([eyeletReady, eyeletUserReady]);
    return allReady;
  };

  useEffect(() => {
    handleEyelet()
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:teamId" element={<Team />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
