async function checkVideoStatus(videoId) {
  var player = GetPlayer();
  const startTime = Date.now();
  const timeout = 4 * 60 * 1000; // 4 minutes timeout

  try {
      const statusResponse = await fetch('https://petconnect-five-xi.vercel.app/api/video-status', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ video_id: videoId })
      });

      const statusData = await statusResponse.json();

      if (statusData.data.status === "completed") {
          // Video is ready
          player.SetVar("videoURL", statusData.data.video_url);
          
          // Update web object with video URL
          const video = GetPlayer().GetWebObject("Morgan Video");
          if (video) {
              video.Change(statusData.data.video_url);
          }
          
          player.SetVar("videoReady", true);
      } else if (Date.now() - startTime > timeout) {
          // Timeout reached, use fallback
          console.log("Video generation timed out");
          player.SetVar("videoFallback", starRating >= 4 ? 1 : starRating === 3 ? 2 : 3);
      } else {
          // Check again in 10 seconds
          setTimeout(() => checkVideoStatus(videoId), 10000);
      }

  } catch (error) {
      console.error('Error checking status:', error);
  }
}